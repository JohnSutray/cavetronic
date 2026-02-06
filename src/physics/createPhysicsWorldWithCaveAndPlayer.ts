import { ColliderDesc, RigidBodyDesc, ShapeType, World } from "@dimforge/rapier2d";
import { createCaveTerrain } from "./createCaveTerrain";
import { createAttachedObject } from "./createAttachedObject";

export function createPhysicsWorldWithCaveAndPlayer() {
  const gravity = { x: 0.0, y: 9.81 };
  const world = new World(gravity);

  createCaveTerrain(world);

  const playerBodyDesc = RigidBodyDesc.dynamic()
    .setTranslation(-10, 4)
    .setLinearDamping(0.5)
    .setAngularDamping(2.0);

  const playerBody = world.createRigidBody(playerBodyDesc);
  const playerHandle = playerBody.handle;

  const playerCollider = ColliderDesc.cuboid(0.4, 0.4)
    .setDensity(1.0)
    .setFriction(1.0)
    .setRestitution(0.0);

  world.createCollider(playerCollider, playerBody);

  const attachedHandle = createAttachedObject(world, playerBody);

  return { world, playerHandle, attachedHandle, ShapeType };
}