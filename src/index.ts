import { Application } from "pixi.js";
import { World } from "@dimforge/rapier2d";
import { createLecs } from "./worlds/LECS";
import { createVecs } from "./worlds/VECS";
import { rafLoop } from "./utils/rafLoop";

async function startInBrowser() {
  const app = new Application();

  await app.init({
    resizeTo: window,
  });

  document.body.appendChild(app.canvas);

  const lecs = createLecs({
    physicsWorld: new World({
      y: 9.8,
      x: 0,
    }),
  });

  const vecs = createVecs({
    pixiApp: app,
    physicsWorld: new World({
      y: 9.8,
      x: 0,
    }),
  });

  rafLoop(8, (deltaTimeMs) => {
    lecs.tick(deltaTimeMs);
    vecs.tick(deltaTimeMs);

    return true;
  })
}

startInBrowser().catch(console.error);