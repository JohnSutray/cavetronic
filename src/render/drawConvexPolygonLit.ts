// src/render/drawConvexPolygonLit.ts
import { World } from "@dimforge/rapier2d";
import { Graphics } from "pixi.js";
import { getEdgeBrightness } from "./lighting";
import { getLights } from "./getLights";
import { brightnessToColor } from "./brightnessToColor";

export function drawConvexPolygonLit(
  world: World,
  g: Graphics,
  vertices: Float32Array,
  worldX: number,
  worldY: number,
  rotation: number,
): void {
  if (vertices.length < 4) {
    return;
  }

  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);
  const vertexCount = vertices.length / 2;

  for (let i = 0; i < vertexCount; i++) {
    const lx1 = vertices[i * 2];
    const ly1 = vertices[i * 2 + 1];
    const lx2 = vertices[((i + 1) % vertexCount) * 2];
    const ly2 = vertices[((i + 1) % vertexCount) * 2 + 1];

    const wx1 = worldX + lx1 * cos - ly1 * sin;
    const wy1 = worldY + lx1 * sin + ly1 * cos;
    const wx2 = worldX + lx2 * cos - ly2 * sin;
    const wy2 = worldY + lx2 * sin + ly2 * cos;

    const brightness = getEdgeBrightness(world, getLights(), wx1, wy1, wx2, wy2);
    const color = brightnessToColor(brightness);

    g.setStrokeStyle({ width: 0.05, color: 0x00ff00 });
    g.moveTo(wx1, wy1);
    g.lineTo(wx2, wy2);
    g.stroke();
  }
}