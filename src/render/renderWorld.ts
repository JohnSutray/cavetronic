// src/render/renderWorld.ts
import { Matrix } from "pixi.js";
import { Collider, World } from "@dimforge/rapier2d";
import { strokeWidth } from './constants';
import { getGraphics } from "./getGraphics";
import { drawCollider } from "./drawCollider";
import { drawLitEdges } from "./drawLitEdges";
import { drawLightDebug } from "./drawLightDebug";

const DIM_COLOR = 0x0a3a0a;

export function renderWorld(world: World): void {
  const g = getGraphics();

  g.clear();

  // Проход 1: все рёбра тусклым
  g.setStrokeStyle({ width: strokeWidth, color: DIM_COLOR });

  world.forEachCollider((collider: Collider) => {
    drawCollider(g, collider);
  });

  g.stroke();

  // Дебаг света (круг радиуса)
  drawLightDebug(world, g);

  // Проход 2: освещённые рёбра + дебаг рейкастов
  drawLitEdges(world, g);

  g.setTransform(new Matrix());
}
