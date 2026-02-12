import { createEntityIndex, createWorld, deleteWorld, getId, withVersioning } from "bitecs";
import type { IEcsWorld, ITickSystem } from "../models";
import { GetDeltaTimeMsToken } from '../services/getDeltaTimeMsToken';
import { GetIndexToken } from '../services/getIndexToken';
import type { ServiceContainer } from "../services/getService";

/** Creates an ECS world with a service container and registers internal services */
export function createEcsWorld({
  services,
  tickSystems,
}: {
  services: ServiceContainer;
  tickSystems: ITickSystem[];
}) {
  const versioning = withVersioning(12);
  const entityIndex = createEntityIndex(versioning);

  services.set(GetIndexToken, (eid: number) => getId(entityIndex, eid));

  let deltaTimeMs = 1;
  services.set(GetDeltaTimeMsToken, () => deltaTimeMs);

  const ecsWorld = createWorld<IEcsWorld>(entityIndex, { services });

  return {
    world: ecsWorld,

    tick(dt: number) {
      deltaTimeMs = dt;

      for (let i = 0; i < tickSystems.length; i++) {
        try {
          tickSystems[i](ecsWorld);
        } catch (e) {
          console.error(e);
        }
      }
    },

    destroy() {
      deleteWorld(ecsWorld);
    },
  };
}
