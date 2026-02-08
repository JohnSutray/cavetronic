import { IWithPhysicsWorld, IWithPixiApp } from "../models";
import { s_sub_colliderRemoveSystem } from "../commonSystems/s_sub_colliderRemoveSystem";
import { s_sub_bodyRemoveSystem } from "../commonSystems/s_sub_bodyRemoveSystem";
import { s_sub_colliderAddSystem } from "../commonSystems/s_sub_colliderAddSystem";
import { s_sub_bodyAddSystem } from "../commonSystems/s_sub_bodyAddSystem";
import { createEcsWorld } from "./createEcsWorld";

export function createVecs(deps: IWithPhysicsWorld & IWithPixiApp) {
  return createEcsWorld({
    ...deps,
    tickSystems: [],
    subscriptionSystems: [
      s_sub_bodyAddSystem,
      s_sub_bodyRemoveSystem,
      s_sub_colliderAddSystem,
      s_sub_colliderRemoveSystem,
    ],
  });
}

