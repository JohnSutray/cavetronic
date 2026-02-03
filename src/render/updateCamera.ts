// src/render/camera.ts
import { Container } from "pixi.js";
import { World } from "@dimforge/rapier2d";

/**
 * Обновляет позицию камеры, следуя за игроком
 */
export function updateCamera(
  worldContainer: Container,
  world: World,
  playerHandle: number
): void {
  const playerBody = world.getRigidBody(playerHandle);

  if (!playerBody) {
    return;
  }

  const pos = playerBody.translation();
  const scale = worldContainer.scale.x;

  worldContainer.scale.set(30, 30);
  worldContainer.position.set(
    window.innerWidth / 2 - pos.x * scale,
    window.innerHeight / 2 - pos.y * scale
  );
}
