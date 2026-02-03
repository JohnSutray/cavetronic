// src/render/drawCuboidLit.ts
import { World } from "@dimforge/rapier2d";
import { Graphics } from "pixi.js";
import { strokeWidth } from './constants';
import { getEdgeBrightness } from "./lighting";
import { getLights } from "./getLights";
import { brightnessToColor } from "./brightnessToColor";

export function drawCuboidLit(
  world: World,
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

  for (let i = 0; i < 4; i++) {
    const [x1, y1] = worldCorners[i];
    const [x2, y2] = worldCorners[(i + 1) % 4];

    const brightness = getEdgeBrightness(world, getLights(), x1, y1, x2, y2);
    const color = brightnessToColor(brightness);

    g.setStrokeStyle({ width: strokeWidth, color: 0x00ff00 });
    g.moveTo(x1, y1);
    g.lineTo(x2, y2);
    g.stroke();
  }
}
