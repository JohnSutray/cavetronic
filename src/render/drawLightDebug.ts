// src/render/drawLightDebug.ts
import { World, Ray } from "@dimforge/rapier2d";
import { Graphics } from "pixi.js";
import { getLights } from "./getLights";

const COLOR_VISIBLE = 0x0000ff;
const COLOR_BLOCKED = 0xff0000;
const COLOR_RADIUS = 0xffff00;

export function drawLightDebug(world: World, g: Graphics): void {
  const lights = getLights();

  for (const light of lights) {
    // Круг радиуса света
    g.setStrokeStyle({ width: 0.1, color: COLOR_RADIUS, alpha: 0.5 });
    g.circle(light.x, light.y, light.radius);
    g.stroke();

    // Центр источника
    g.setStrokeStyle({ width: 0.1, color: 0xffffff });
    g.circle(light.x, light.y, 0.2);
    g.stroke();
  }
}

export function drawRaycastDebug(
  world: World,
  g: Graphics,
  lightX: number,
  lightY: number,
  targetX: number,
  targetY: number,
  maxDistance: number,
): void {
  const dx = targetX - lightX;
  const dy = targetY - lightY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < 0.01) {
    return;
  }

  const dirX = dx / distance;
  const dirY = dy / distance;

  const ray = new Ray(
    { x: lightX, y: lightY },
    { x: dirX, y: dirY },
  );

  const hit = world.castRay(ray, Math.min(distance, maxDistance), true);

  let isVisible = true;
  let hitPoint = { x: targetX, y: targetY };

  if (hit) {
    const hitDistance = hit.timeOfImpact;

    if (hitDistance < distance - 0.1) {
      isVisible = false;
      hitPoint = {
        x: lightX + dirX * hitDistance,
        y: lightY + dirY * hitDistance,
      };
    }
  }

  const color = isVisible ? COLOR_VISIBLE : COLOR_BLOCKED;

  // Линия от источника до точки попадания
  g.setStrokeStyle({ width: 0.1, color, alpha: 0.7 });
  g.moveTo(lightX, lightY);
  g.lineTo(hitPoint.x, hitPoint.y);
  g.stroke();

  // Точка попадания
  g.setStrokeStyle({ width: 0.05, color });
  g.circle(hitPoint.x, hitPoint.y, 0.1);
  g.stroke();

  // Целевая точка (если отличается)
  if (!isVisible) {
    g.setStrokeStyle({ width: 0.05, color: COLOR_BLOCKED, alpha: 0.3 });
    g.circle(targetX, targetY, 0.1);
    g.stroke();
  }
}