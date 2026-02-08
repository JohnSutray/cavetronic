// src/render/initPixiRenderer.ts
import { Application } from "pixi.js";
import { initWorldContainer, getWorldContainer } from "./getWorldContainer";
import { initGraphics, getGraphics } from "./getGraphics";

let app: Application;

export async function initPixiRenderer(): Promise<void> {
  app = new Application();

  await app.init({
    resizeTo: window,
    backgroundColor: 0x000000,
  });

  document.body.appendChild(app.canvas);

  initWorldContainer();
  initGraphics();

  const container = getWorldContainer();
  const graphics = getGraphics();

  app.stage.addChild(container);
  container.scale.set(20, 20);
  container.position.set(window.innerWidth / 2, window.innerHeight / 2);
  container.addChild(graphics);

  window.addEventListener("resize", () => {
    container.position.set(window.innerWidth / 2, window.innerHeight / 2);
  });
}