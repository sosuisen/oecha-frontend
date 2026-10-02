# ペンの色を変える
- [ ] R,G,Bのテキストフィールドに直接値入力

# TextureSurface
- [ ] TextureSurfaceのテストを書く（PixiJS 8.20のCanvasRendererを使う）。
    - [ ] spike: jsdom上で `app.init({ preference: 'canvas', autoStart: false })` が通るか確認する。
    - [ ] `src/layer/texture-surface.spec.ts` を書く。`renderer.extract.pixels()` で色を確認する。
      - Graphicsは座標に0.5を足さない。1pxの線は半透明になりうるので、太い線か中央付近のピクセルを見る。
      - afterEachで `app.destroy()` を呼ぶ。
    - [ ] canvas用Applicationを作るヘルパーを `src/testing/` に置く。
    - `src/testing/canvas-surface.ts` は軽いフェイクとして残す。

# main.ts
- [ ] main.tsをテスト可能にする。
    - [ ] 配線部分を `composeApp(app: Application)` のような純粋関数に切り出す。
    - [ ] main.tsには `app.init` と `appendChild` だけを残す。
    - [ ] `composeApp` のspecを書く。CanvasRendererのApplicationを渡し、レイヤーがstageに載ること、pointerイベントで線が描けることを確認する。
