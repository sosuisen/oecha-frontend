# RenderTexture への焼き込み（メモ）

作成日: 2026-09-13
背景: ビットマップペイントなのに `Graphics` にベクター命令を蓄積するのは本質とずれている、という指摘への回答。
PixiJS v8.8.1 の型定義とソースを確認して書いた。

## 結論

- PixiJS にはピクセルを直接塗る API がない。ビットマップとして扱えるのはテクスチャだけ。
- レイヤーの実体を `RenderTexture` にし、ストロークは一時的な `Graphics`（ブラシ形状）を `renderer.render({ target })` で焼き込んでから捨てる。
- 命令列は蓄積しない。ピクセルだけが残る。

## 基本形

```ts
import { Graphics, RenderTexture, Sprite } from 'pixi.js';

// 1. レイヤーの実体。GPU 上のピクセルバッファ
const renderTexture = RenderTexture.create({ width: 800, height: 600 });

// 2. 画面に見せるための Sprite。テクスチャを参照するだけ
const layerSprite = new Sprite(renderTexture);
app.stage.addChild(layerSprite);

// 3. ストロークを焼き込む
const brush = new Graphics()
  .moveTo(0, 0).lineTo(10, 10).lineTo(20, 0)
  .stroke({ width: 4, color: 0x000000 });

app.renderer.render({
  container: brush,        // 描くもの
  target: renderTexture,   // 描き先
  clear: false,            // 既存のピクセルを消さずに上書き
});

brush.destroy();           // 焼き込んだら不要
```

## `renderer.render()` の主なオプション

| オプション | 意味 |
|------|------|
| `container` | 描くシーン。`stage` に載せる必要はなく、単独の `Graphics` でもよい |
| `target` | 描き先。省略すると画面。`RenderTexture` を渡すとそこに描く |
| `clear` | 描く前に描き先を消すか。**既定は `true`** なので、蓄積したいときは `false` が必須 |
| `clearColor` | `clear` 時の色。透明にしたければ `[0, 0, 0, 0]` |
| `transform` | `container` に掛ける変換行列。ズームやパンをレイヤー座標に反映するときに使う |

## 「焼き込んで捨てる」の意味

1. `brush` はベクター命令を持つ `Graphics` で、この時点ではまだ何もピクセルになっていない。
2. `render()` を呼ぶと、レンダラーが `brush` をジオメトリに変換し、GPU が `renderTexture` の該当ピクセルを塗る。この結果は `renderTexture` の中に**ピクセルとして残る**。
3. `brush` 自身はもう参照されないので `destroy()` して捨てる。命令列は蓄積しない。
4. `layerSprite` は `renderTexture` を参照しているだけなので、次のフレームから自動的に新しいピクセルが見える。

## ベクター蓄積との比較

| | `Graphics` 蓄積 | `RenderTexture` 焼き込み |
|------|------|------|
| レイヤーに残るもの | 命令のリスト | ピクセル |
| ストロークが増えると | 命令が増え、再変換が重くなる | 一定。ピクセル数は変わらない |
| 消しゴム | 命令の削除。ピクセル単位は不可 | `brush.blendMode = 'erase'` で焼き込めば、そのピクセルが透明になる |
| Undo | 命令を取り除けば戻る | ピクセルは戻せない。スナップショットか、コマンド履歴からの再描画が要る |
| 拡大 | 滑らか | ぼやける（ビットマップの性質） |

## 注意点

- `RenderTexture` は既定で透明で初期化される。背景色はレイヤーの下に別の `Sprite` や `Graphics` を置くか、最初に `clear: true, clearColor: '#ffffff'` で一度塗る。
- 座標は `renderTexture` の左上が原点。`layerSprite` を移動していても、焼き込み時の座標は `Sprite` の位置に影響されない。
- 高 DPI 対応で `resolution` を 2 にしている場合、`RenderTexture.create({ resolution: 2 })` もそろえないとぼやける。
- Undo が必要になったときに効くのが、今作っているコマンドの履歴。「点列を持つコマンドを保持し、Undo は履歴の先頭から焼き直す」という設計なら、ビットマップでも Undo が実現できる。今の `PenCommand` が点列を持つ設計はそのまま生きる。

## テストへの影響

- `render()` はレンダラーの機能なので jsdom では呼べない（層 3）。
- `Layer` に `bake(container)` のような薄いメソッドを作って `renderer.render()` の呼び出しを閉じ込め、`PenCommand` のテストでは `bake` が正しい引数で呼ばれたことをモックで検証する、という分担になる。
- 実際にピクセルが塗られたかは、実ブラウザでの確認。

## 関連するこれまでの話

- `Graphics.stroke()` は既存命令を再実行せず、作業中パスを複製して 1 命令として末尾に追加し、作業中パスを最後の点にリセットする。変更があると命令列全体が再変換される。
- ドラッグ中のプレビューは、確定前の点列を別の `Graphics` に `clear()` してから描き直す（命令を常に 1 つに保つ）。`pointerup` で焼き込んでからプレビューを消す。
- レイヤー方式の選択肢: A. `RenderTexture`（GPU、推奨） / B. Canvas 2D（CPU、ピクセル操作が素直） / C. `Graphics` 蓄積（ベクター画向け、現状）。
- これは後から変えにくい決定なので、方式を決めたら ADR に記録する候補。

## 追記: テストダブルで描画結果を検証する

「PixiJS のレンダラーは jsdom で動かない」は本当だが、テストしたいのは「アプリがレイヤーに何を描いたか」であって PixiJS のラスタライズではない。描画面を抽象化すれば、描画結果はテストできる。

```ts
export interface DrawingSurface {
  strokePolyline(points: Point[], style: StrokeStyle): void;
}
```

| 実装 | 動く環境 | ピクセル検証 | 用途 |
|------|------|------|------|
| スパイ（呼び出し記録） | 純粋な TS | しない | 「何を描く要求をしたか」の検証 |
| フェイクのビットマップ（自前の配列 + 簡易ラスタライザ） | 純粋な TS | 自前の規則で可 | 消しゴムや重ね順などのロジック検証 |
| Canvas 2D（jsdom + `canvas` パッケージ） | jsdom | `getImageData()` で本物の描画結果 | 線幅やアンチエイリアスを含めた検証 |
| PixiJS `RenderTexture` | 実ブラウザ | `renderer.extract` | 本番。テストは薄いアダプタとして最小限 |

- Canvas 2D の `DrawingSurface` は本番の実装候補（方式 B）にもなる。オフスクリーン canvas に描き、`Texture.from(canvas)` で PixiJS に載せる。テストで検証する実装と本番が同一になる。
- 方式 A（`RenderTexture`）と B（Canvas 2D）のどちらを本番にするかは、テストのしやすさも含めて判断する。
- 今の `Layer` は `Graphics` を公開しており PixiJS の型が上位層に漏れている。`Layer` が `DrawingSurface` を実装する（または持つ）形にすると `PenCommand` から PixiJS への依存が消える。
