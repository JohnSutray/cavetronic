// src/render/drawCollider.ts
import { Collider, ShapeType } from "@dimforge/rapier2d";
import { Graphics } from "pixi.js";
import { drawCuboid } from "./drawCuboid";
import { drawConvexPolygon } from "./drawConvexPolygon";

export function drawCollider(g: Graphics, collider: Collider): void {
  const parent = collider.parent();

  if (!parent) {
    return;
  }

  const pos = parent.translation();
  const rot = parent.rotation();
  const shape = collider.shapeType();

  if (shape === ShapeType.Cuboid) {
    const he = collider.halfExtents();
    drawCuboid(g, he.x, he.y, pos.x, pos.y, rot);
  }

  if (shape === ShapeType.ConvexPolygon) {
    const verts = collider.vertices();
    drawConvexPolygon(g, verts, pos.x, pos.y, rot);
  }

  if (shape === ShapeType.Ball) {
    const radius = collider.radius();
    g.circle(pos.x, pos.y, radius);
  }
}