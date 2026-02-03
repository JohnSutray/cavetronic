// src/physics/player.ts
import { World } from "@dimforge/rapier2d";

const keys: Record<string, boolean> = {};

document.addEventListener("keydown", (e) => {
  keys[e.code] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

const MAX_SPEED = 5.0;

/**
 * Применяет вращение и горизонтальную силу с ограничением скорости
 */
export function applyPlayerInput(world: World, playerHandle: number) {
  const playerBody = world.getRigidBody(playerHandle);

  if (!playerBody) {
    return;
  }

  const velocity = playerBody.linvel();
  const torque = 0.22;
  const horizontalForce = 0.4;

  if (keys["KeyA"] || keys["KeyW"]) {
    playerBody.applyTorqueImpulse(-torque, true);

    if (velocity.x > -MAX_SPEED) {
      playerBody.applyImpulse({ x: -horizontalForce, y: 0 }, true);
    }
  }

  if (keys["KeyD"]) {
    playerBody.applyTorqueImpulse(torque, true);

    if (velocity.x < MAX_SPEED) {
      playerBody.applyImpulse({ x: horizontalForce, y: 0 }, true);
    }
  }
}
