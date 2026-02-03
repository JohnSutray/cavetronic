// src/render/drawCuboid.ts
import { Graphics } from "pixi.js";

const DIM_COLOR = 0x0a3a0a;

export function drawCuboid(
  g: Graphics,
  hx: number,
  hy: number,
  worldX: number,
  worldY: number,
  rotation: number,
): void {
  const corners = [
    [-hx, -hy],
    [hx, -hy],
    [hx, hy],
    [-hx, hy],
  ];

  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);

  const worldCorners = corners.map(([lx, ly]) => [
    worldX + lx * cos - ly * sin,
    worldY + lx * sin + ly * cos,
  ]);

  g.moveTo(worldCorners[0][0], worldCorners[0][1]);

  for (let i = 1; i < worldCorners.length; i++) {
    g.lineTo(worldCorners[i][0], worldCorners[i][1]);
  }

  g.closePath();
}