// src/physics/player.ts
import { World } from "@dimforge/rapier2d";

const keys: Record<string, boolean> = {};

document.addEventListener("keydown", (e) => {
  keys[e.code] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

const MAX_SPEED = 4.0;
const MAX_ANGVEL = 6.0;

/**
 * Применяет вращение и горизонтальную силу с ограничением скорости
 */
export function applyPlayerInput(world: World, playerHandle: number) {
  const playerBody = world.getRigidBody(playerHandle);

  if (!playerBody) {
    return;
  }

  const velocity = playerBody.linvel();
  const angvel = playerBody.angvel();
  const torque = 0.10;
  const horizontalForce = 0.2;

  if (keys["KeyA"] || keys["KeyW"]) {
    if (angvel > -MAX_ANGVEL) {
      playerBody.applyTorqueImpulse(-torque, true);
    }

    if (velocity.x > -MAX_SPEED) {
      playerBody.applyImpulse({ x: -horizontalForce, y: 0 }, true);
    }
  }

  if (keys["KeyD"]) {
    if (angvel < MAX_ANGVEL) {
      playerBody.applyTorqueImpulse(torque, true);
    }

    if (velocity.x < MAX_SPEED) {
      playerBody.applyImpulse({ x: horizontalForce, y: 0 }, true);
    }
  }
}
