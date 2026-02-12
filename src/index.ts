import { Application } from 'pixi.js';
import { WorkerTransportClient } from './transport/WorkerTransportClient';
import { createPhysicsWorld } from './utils/createPhysicsWorld';
import { rafLoop } from './utils/rafLoop';
import { createVecs } from './worlds/VECS';

async function startInBrowser() {
  const pixiApp = new Application();

  await pixiApp.init({ resizeTo: window, background: 0x000000 });

  document.body.appendChild(pixiApp.canvas);

  const worker = new Worker(new URL('./workers/lecs.worker.ts', import.meta.url));
  const transport = new WorkerTransportClient(worker);

  const physicsWorld = createPhysicsWorld();

  const vecs = createVecs({
    pixiApp,
    physicsWorld,
    transport,
  });

  rafLoop(8, (deltaTimeMs) => {
    vecs.tick(deltaTimeMs);

    return true;
  })(0);
}

startInBrowser().catch(console.error);
