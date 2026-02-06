import { IEcsWorld, IPhysicsWorld } from "../models";
import { createEntityIndex, createWorld, getId, withVersioning } from "bitecs";
import { S_Once_BodyReconciliation } from "../systems/S_Once_BodyReconciliation";
import { S_Once_ColliderReconciliation } from "../systems/S_Once_ColliderReconciliation";

export const createServerWorld = (physicsWorld: IPhysicsWorld) => {
  const versioning = withVersioning(12);
  const entityIndex = createEntityIndex(versioning);
  const ecsWorld = createWorld<IEcsWorld>(entityIndex, {
    physicsWorld,
    getIndex(eid: number): number {
      return getId(entityIndex, eid);
    },
  });

  const subscriptions = [
    S_Once_BodyReconciliation(ecsWorld),
    S_Once_ColliderReconciliation(ecsWorld),
  ].flatMap(s => s);

  return {
    destroy() {
      for (const subscription of subscriptions) {
        subscription();
      }
    },
  };
};

