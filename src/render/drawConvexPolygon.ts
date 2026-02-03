// src/render/drawConvexPolygon.ts
import { Graphics } from "pixi.js";

export function drawConvexPolygon(
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

  const lx0 = vertices[0];
  const ly0 = vertices[1];
  const wx0 = worldX + lx0 * cos - ly0 * sin;
  const wy0 = worldY + lx0 * sin + ly0 * cos;

  g.moveTo(wx0, wy0);

  for (let i = 1; i < vertexCount; i++) {
    const lx = vertices[i * 2];
    const ly = vertices[i * 2 + 1];
    const wx = worldX + lx * cos - ly * sin;
    const wy = worldY + lx * sin + ly * cos;

    g.lineTo(wx, wy);
  }

  g.closePath();
}