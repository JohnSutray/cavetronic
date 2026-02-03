// src/render/lighting.ts
import { World, Ray } from "@dimforge/rapier2d";

export interface LightSource {
  x: number;
  y: number;
  radius: number;
  intensity: number;
}

/**
 * Проверяет видимость точки от источника света
 */
function isPointLit(
  world: World,
  light: LightSource,
  pointX: number,
  pointY: number
): boolean {
  const dx = pointX - light.x;
  const dy = pointY - light.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance > light.radius) {
    return false;
  }

  if (distance < 0.01) {
    return true;
  }

  const ray = new Ray(
    { x: light.x, y: light.y },
    { x: dx / distance, y: dy / distance }
  );

  const hit = world.castRay(ray, distance, true);

  if (!hit) {
    return true;
  }

  const hitDistance = hit.timeOfImpact;

  return hitDistance >= distance - 0.1;
}

/**
 * Вычисляет яркость для точки (0-1)
 */
export function getPointBrightness(
  world: World,
  lights: LightSource[],
  pointX: number,
  pointY: number
): number {
  let totalBrightness = 0;

  for (const light of lights) {
    if (!isPointLit(world, light, pointX, pointY)) {
      continue;
    }

    const dx = pointX - light.x;
    const dy = pointY - light.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const falloff = 1 - distance / light.radius;
    const brightness = Math.max(0, falloff * light.intensity);

    totalBrightness += brightness;
  }

  return Math.min(1, totalBrightness);
}

/**
 * Вычисляет яркость для ребра (среднее двух точек)
 */
export function getEdgeBrightness(
  world: World,
  lights: LightSource[],
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const b1 = getPointBrightness(world, lights, x1, y1);
  const b2 = getPointBrightness(world, lights, x2, y2);

  return (b1 + b2) / 2;
}