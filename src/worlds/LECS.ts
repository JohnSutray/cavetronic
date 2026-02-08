import { createEntityIndex, createWorld, getId, withVersioning, deleteWorld } from 'bitecs';
import { IEcsWorld, IPhysicsWorld } from '../models';
import { s_sub_colliderRemoveSystem } from '../systems/s_sub_colliderRemoveSystem';
import { s_sub_bodyRemoveSystem } from '../systems/s_sub_bodyRemoveSystem';
import { s_sub_colliderAddSystem } from '../systems/s_sub_colliderAddSystem';
import { s_sub_bodyAddSystem } from '../systems/s_sub_bodyAddSystem';

export const LECS = (physicsWorld: IPhysicsWorld) => {
  const versioning = withVersioning(12);
  const entityIndex = createEntityIndex(versioning);
  const ecsWorld = createWorld<IEcsWorld>(entityIndex, {
    physicsWorld,
    getIndex(eid: number): number {
      return getId(entityIndex, eid);
    },
  });

  const subscriptions = [
    s_sub_bodyAddSystem(ecsWorld),
    s_sub_bodyRemoveSystem(ecsWorld),
    s_sub_colliderAddSystem(ecsWorld),
    s_sub_colliderRemoveSystem(ecsWorld),
  ];

  return {
    destroy() {
      for (const subscription of subscriptions) {
        subscription();
      }

      deleteWorld(ecsWorld);
      physicsWorld.free();
    },
  };
};

