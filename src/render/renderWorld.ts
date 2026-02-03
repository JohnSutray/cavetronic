// src/render/pixiWorld.ts
import { Matrix } from "pixi.js";
import { Collider, World } from "@dimforge/rapier2d";

import { getGraphics } from "./getGraphics";
import { drawCollider } from "./drawCollider";

/**
 * Рендерит физический мир
 */
export function renderWorld(world: World): void {
  getGraphics().clear();

  world.forEachCollider((collider: Collider) => {
    drawCollider(world, getGraphics(), collider);
  });

  getGraphics().setTransform(new Matrix());
}

