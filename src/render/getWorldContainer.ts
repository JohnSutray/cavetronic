// src/render/getWorldContainer.ts
import { Container } from "pixi.js";

let worldContainer: Container | null = null;

export function initWorldContainer(): void {
  worldContainer = new Container();
}

export function getWorldContainer(): Container {
  if (!worldContainer) {
    throw new Error("WorldContainer not initialized");
  }

  return worldContainer;
}