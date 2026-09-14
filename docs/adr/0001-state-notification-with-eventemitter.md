# ADR-0001: アプリの状態通知に pixi.js の EventEmitter を使う

作成日: 2026-09-14
状態: 採択

## 文脈

- ツールの切り替え（ペン / 消しゴム）やペンサイズの変更を、画面上の情報表示（`Info`）に反映したい。
- 現在は `EventRouter` が `currentTool` を私有しており、他のクラスは変更を知る手段がない。
- 状態を持つ側と表示する側が互いを直接参照すると、依存が増えてテストしづらくなる。

## 決定

- アプリの状態（ツール、ペンサイズなど）は、専用のモデルクラス（例: `ToolState`）に切り出す。
- モデルクラスは `pixi.js` が再エクスポートする `EventEmitter`（実体は eventemitter3）を継承し、
  変更時に `emit('change', value)` で通知する。
- イベント名と引数の型はジェネリクスで固定する。
  例: `class ToolState extends EventEmitter<{ change: [Tool] }>`
- 状態を変える側（`EventRouter`）と見る側（`Info`）は、ともにモデルクラスにだけ依存する。
- 同じ値を設定したときは通知しない。

## 理由

- PixiJS 自身が `Container` や `Texture` の通知に同じ `EventEmitter` を使っており、
  プロジェクト内で作法が一つにまとまる。
- 追加のインストールが不要で、 PixiJSと同じバージョンの `eventemitter3` が使える。
- `on / off / once` が揃っており、購読解除を自前で書かなくてよい。
- レンダラーに触れないため、jsdom 上の Vitest でそのままテストできる。

## 検討した代替案

- 素の TypeScript でリスナー配列を持つ observer
  - 依存はゼロだが、`off` や `once` を自前で書く必要がある。規模が小さいので差は小さい。
- DOM の `EventTarget` + `CustomEvent`
  - `detail` の型付けが弱く、ラッパーが必要になる。
- PixiJS の `FederatedEvent`（`container.on('pointerdown')` など）
  - 表示オブジェクトへの入力専用であり、アプリの状態通知には向かない。

## 影響

- 良い点: `Info` と `EventRouter` が疎結合になる。状態の単体テストが書きやすい。
- 注意点: `emit` は同期で、リスナーは登録順にその場で呼ばれる。
  リスナー内で重い処理や再帰的な `set` をしない。
- 注意点: アプリの状態モデルが `pixi.js` に依存する。
  将来描画ライブラリを差し替える場合は、import 元を `eventemitter3` に変えるだけで済む。
