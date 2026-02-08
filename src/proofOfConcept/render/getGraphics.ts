// src/render/getGraphics.ts
import { Graphics } from "pixi.js";

let graphics: Graphics | null = null;

export function initGraphics(): void {
  graphics = new Graphics();
}

export function getGraphics(): Graphics {
  if (!graphics) {
    throw new Error("Graphics not initialized");
  }

  return graphics;
}