import { RigidBodyDesc } from "@dimforge/rapier2d";
import { IEcsWorld } from "../models";
import { observe, onAdd, onRemove } from "bitecs";
import { C_Body, C_Position, C_Rotation } from "../components";
import { E_BodyType_Dynamic, E_BodyType_Fixed, E_BodyType_Kinematic } from "../constants";

function bodyTypeToBodyDescriptor(type: number) {
  if (type === E_BodyType_Dynamic) {
    return RigidBodyDesc.dynamic();
  }

  if (type === E_BodyType_Fixed) {
    return RigidBodyDesc.fixed();
  }

  if (type === E_BodyType_Kinematic) {
    return RigidBodyDesc.kinematicPositionBased();
  }

  throw new Error(`Unknown body type ${type}`);
}

export function S_Once_BodyReconciliation(world: IEcsWorld) {
  return [
    observe(world, onAdd(C_Position, C_Rotation, C_Body), eid => {
      const index = world.getIndex(eid);
      const type = C_Body.type[index];
      const handle = C_Body.handle[index];

      if (handle) {
        const body = world.physicsWorld.getRigidBody(handle);

        if (body) {
          body.userData = eid;

          return;
        }
      }

      const bodyDescriptor = bodyTypeToBodyDescriptor(type);

      const body = world.physicsWorld.createRigidBody(bodyDescriptor);

      body.userData = eid;
    }),

    observe(world, onRemove(C_Body), eid => {
      const index = world.getIndex(eid);
      const handle = C_Body.handle[index];

      const body = world.physicsWorld.getRigidBody(handle);

      if (body) {
        world.physicsWorld.removeRigidBody(body);
        C_Body.handle[index] = 0;
      }
    }),
  ];
}