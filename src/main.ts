import { Application } from 'pixi.js';
import { EventRouter } from './event-router';

(async () => {
  const app = new Application();
  await app.init({ background: '#1099bb', resizeTo: window });
  document.getElementById('pixi-container')!.appendChild(app.canvas);

  const eventRouter = new EventRouter(app.canvas);
  app.stage.addChild(eventRouter.getCurrentLayer().getGraphics());
})();
