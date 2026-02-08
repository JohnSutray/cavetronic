import { IEcsWorld, ISubscriptionSystem, ITickSystem, IWithPhysicsWorld, IWithPixiApp } from "../models";
import { createEntityIndex, createWorld, deleteWorld, getId, withVersioning } from "bitecs";

export const createEcsWorld = ({
  physicsWorld,
  subscriptionSystems,
  tickSystems,
  pixiApp
}: IWithPhysicsWorld & IWithPixiApp & {
  subscriptionSystems: ISubscriptionSystem[];
  tickSystems: ITickSystem[];
}) => {
  const versioning = withVersioning(12);
  const entityIndex = createEntityIndex(versioning);
  const ecsWorld = createWorld<IEcsWorld>(entityIndex, {
    physicsWorld,
    pixiApp,
    getIndex(eid: number): number {
      return getId(entityIndex, eid);
    },
    deltaTimeMs: 1,
  });

  const subscriptions = subscriptionSystems.map(s => s(ecsWorld));

  return {
    tick(deltaTimeMs: number) {
      ecsWorld.deltaTimeMs = deltaTimeMs;

      for (let i = 0; i < tickSystems.length; i++){
        const tickSystem = tickSystems[i];

        try {
          tickSystem(ecsWorld);
        } catch (e) {
          console.error(e);
        }
      }
    },
    destroy() {
      for (const subscription of subscriptions) {
        subscription();
      }

      deleteWorld(ecsWorld);
    },
  };
};