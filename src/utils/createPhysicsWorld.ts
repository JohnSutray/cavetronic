import { RigidBodyDesc, World } from '@dimforge/rapier2d';
import { gravity } from '../constants';

export function createPhysicsWorld() {
  const world = new World(gravity);
  const zeroIdBody = world.createRigidBody(RigidBodyDesc.fixed());

  world.removeRigidBody(zeroIdBody);

  return world;
}
