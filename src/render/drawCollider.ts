import { Collider, ShapeType, World } from "@dimforge/rapier2d";
import { Graphics, Matrix } from "pixi.js";
import { drawCuboidLit } from "./drawCuboidLit";
import { drawConvexPolygonLit } from "./drawConvexPolygonLit";
import { getEdgeBrightness } from "./lighting";
import { getLights } from "./getLights";
import { brightnessToColor } from "./brightnessToColor";

/**
 * Рисует один коллайдер
 */
export function drawCollider(world: World, g: Graphics, collider: Collider): void {
  const parent = collider.parent();

  if (!parent) {
    return;
  }

  const pos = parent.translation();
  const rot = parent.rotation();
  const shape = collider.shapeType();

  const cos = Math.cos(rot);
  const sin = Math.sin(rot);

  const matrix = new Matrix(cos, sin, -sin, cos, pos.x, pos.y);
  g.setTransform(matrix);

  if (shape === ShapeType.Cuboid) {
    const he = collider.halfExtents();
    drawCuboidLit(world, g, he.x, he.y, pos.x, pos.y, rot);
  }

  if (shape === ShapeType.ConvexPolygon) {
    const verts = collider.vertices();
    drawConvexPolygonLit(world, g, verts, pos.x, pos.y, rot);
  }

  if (shape === ShapeType.Ball) {
    const radius = collider.radius();
    const brightness = getEdgeBrightness(
      world, getLights(),
      pos.x, pos.y - radius,
      pos.x, pos.y + radius,
    );
    const color = brightnessToColor(brightness);

    g.setStrokeStyle({ width: 0.05, color });
    g.circle(0, 0, radius);
    g.stroke();
  }
}