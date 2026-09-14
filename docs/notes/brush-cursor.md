# ブラシカーソル（メモ）

作成日: 2026-09-15
目的: ツールサイズと同じ直径の円をマウスポインタの位置に表示する。

## 方針

- 円はレイヤー（RenderTexture）には焼き込まず、ステージ上の別オブジェクトとして重ねる。
- `Info` と同じ作りにする。`ToolState` の `change` を購読して半径を更新し、`pointermove` で位置だけ動かす。
- 円は原点 (0, 0) を中心に描き、移動は `position` で行う。描き直すのはサイズが変わったときだけ。
- 色は #808080（中間のグレー）。背景が白でも黒でも見える。
- 座標は `clientX` / `clientY` をそのまま使う。`PenCommand` と同じ値なので線と円が重なる。
  将来ズームやパンを入れたら、両方まとめて変換する。

## 実装案: `src/ui/brush-cursor.ts`

```ts
import { Container, Graphics } from 'pixi.js';
import { ToolState } from '../tool/tool-state';

export class BrushCursor {
  private readonly root: Container;
  private readonly toolState: ToolState;
  private readonly circle = new Graphics();

  constructor(root: Container, toolState: ToolState, canvas: HTMLCanvasElement) {
    this.root = root;
    this.toolState = toolState;

    this.redraw();
    this.toolState.on('change', () => this.redraw());

    canvas.addEventListener('pointermove', e => {
      this.circle.position.set(e.clientX, e.clientY);
    });
    canvas.addEventListener('pointerenter', () => (this.circle.visible = true));
    canvas.addEventListener('pointerleave', () => (this.circle.visible = false));
    this.circle.visible = false;
  }

  /** ツールサイズに合わせて円を描き直す。位置は変えない */
  private redraw(): void {
    const radius = this.toolState.getCurrentTool().sizeSettings.get() / 2;
    this.circle
      .clear()
      .circle(0, 0, radius)
      .stroke({ width: 1, color: 0x808080 });
  }

  show(): void {
    this.root.addChild(this.circle);
  }
}
```

## `main.ts` の組み立て

`addChild` の順が重ね順。円は絵より上、文字より下に置く。

```ts
app.stage.addChild(layerSprite);          // 一番下: 絵

const cursorContainer = new Container();  // その上: 円
app.stage.addChild(cursorContainer);
new BrushCursor(cursorContainer, toolState, app.canvas).show();

app.stage.addChild(infoContainer);        // 一番上: 文字
```

## OS のマウスカーソルを消す

円と矢印が両方見えると邪魔なので、キャンバス上だけ隠す。
`index.html` の CSS か、`app.canvas.style.cursor = 'none'` のどちらか。

```css
canvas { cursor: none; }
```

## 補足

- ツール切り替えとホイールはどちらも `ToolState` の `change` を発火するので、円の半径は自動で追従する。追加コードは不要。
- `pointerleave` で隠さないと、マウスがキャンバス外に出たときに円が端に取り残される。

## テスト案: `src/ui/brush-cursor.spec.ts`

jsdom でも `Graphics` は生成と描画命令の記録まで動く。

- `pointermove` を dispatch した後、`root.children[0].position` が (x, y) になる。
- `sizeSettings.set(20)` の後、`root.children[0].getLocalBounds().width` がおよそ 20 になる。
  `toBeCloseTo` で比べる。`getLocalBounds()` は CPU 側で計算されるのでレンダラーは不要。
  jsdom でエラーになったら別の検証方法を検討する。

## plans.md への追記候補

- [ ] ツールサイズと同じ直径の円をマウスポインタの位置に表示する
