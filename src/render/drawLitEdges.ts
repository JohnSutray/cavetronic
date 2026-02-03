// src/render/drawLitEdges.ts
import { World, Collider, ShapeType } from "@dimforge/rapier2d";
import { Graphics } from "pixi.js";
import { strokeWidth } from './constants';
import { getLights } from "./getLights";
import { getPointBrightness } from "./lighting";
import { drawRaycastDebug } from "./drawLightDebug";

const BRIGHT_COLOR = 0x00ff00;
const BRIGHTNESS_THRESHOLD = 0.1;
const DEBUG_ENABLED = false;

export function drawLitEdges(world: World, g: Graphics): void {
  const lights = getLights();

  if (lights.length === 0) {
    return;
  }

  world.forEachCollider((collider: Collider) => {
    const parent = collider.parent();

    if (!parent) {
      return;
    }

    const pos = parent.translation();
    const rot = parent.rotation();

    const cos = Math.cos(rot);
    const sin = Math.sin(rot);

    const edges = getColliderEdges(collider, pos.x, pos.y, cos, sin);

    for (const edge of edges) {
      const midX = (edge.x1 + edge.x2) / 2;
      const midY = (edge.y1 + edge.y2) / 2;

      // Дебаг рейкастов
      if (DEBUG_ENABLED) {
        for (const light of lights) {
          drawRaycastDebug(world, g, light.x, light.y, midX, midY, light.radius);
        }
      }

      const b1 = getPointBrightness(world, lights, edge.x1, edge.y1);
      const b2 = getPointBrightness(world, lights, edge.x2, edge.y2);
      const brightness = (b1 + b2) / 2;

      if (brightness > BRIGHTNESS_THRESHOLD) {
        const alpha = Math.min(1, brightness);

        g.setStrokeStyle({ width: strokeWidth, color: BRIGHT_COLOR, alpha });
        g.moveTo(edge.x1, edge.y1);
        g.lineTo(edge.x2, edge.y2);
        g.stroke();
      }
    }
  });
}

interface Edge {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

function getColliderEdges(
  collider: Collider,
  worldX: number,
  worldY: number,
  cos: number,
  sin: number,
): Edge[] {
  const shape = collider.shapeType();
  const edges: Edge[] = [];

  if (shape === ShapeType.Cuboid) {
    const he = collider.halfExtents();
    const corners = [
      [-he.x, -he.y],
      [he.x, -he.y],
      [he.x, he.y],
      [-he.x, he.y],
    ];

    const worldCorners = corners.map(([lx, ly]) => [
      worldX + lx * cos - ly * sin,
      worldY + lx * sin + ly * cos,
    ]);

    for (let i = 0; i < 4; i++) {
      const [x1, y1] = worldCorners[i];
      const [x2, y2] = worldCorners[(i + 1) % 4];
      edges.push({ x1, y1, x2, y2 });
    }
  }

  if (shape === ShapeType.ConvexPolygon) {
    const verts = collider.vertices();
    const vertexCount = verts.length / 2;

    for (let i = 0; i < vertexCount; i++) {
      const lx1 = verts[i * 2];
      const ly1 = verts[i * 2 + 1];
      const lx2 = verts[((i + 1) % vertexCount) * 2];
      const ly2 = verts[((i + 1) % vertexCount) * 2 + 1];

      edges.push({
        x1: worldX + lx1 * cos - ly1 * sin,
        y1: worldY + lx1 * sin + ly1 * cos,
        x2: worldX + lx2 * cos - ly2 * sin,
        y2: worldY + lx2 * sin + ly2 * cos,
      });
    }
  }

  if (shape === ShapeType.Ball) {
    const radius = collider.radius();
    const segments = 16;

    for (let i = 0; i < segments; i++) {
      const a1 = (i / segments) * Math.PI * 2;
      const a2 = ((i + 1) / segments) * Math.PI * 2;

      edges.push({
        x1: worldX + Math.cos(a1) * radius,
        y1: worldY + Math.sin(a1) * radius,
        x2: worldX + Math.cos(a2) * radius,
        y2: worldY + Math.sin(a2) * radius,
      });
    }
  }

  return edges;
}
