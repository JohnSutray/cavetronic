import { IEcsWorld } from "../models";
import { getRelationTargets, observe, onAdd, onRemove } from "bitecs";
import { C_Body, C_Collider, R_ChildColliderOf } from "../components";
import { ColliderDesc } from "@dimforge/rapier2d";

export function S_Once_ColliderReconciliation(world: IEcsWorld) {
  return [
    observe(world, onAdd(C_Collider, R_ChildColliderOf("*")), eid => {
      const index = world.getIndex(eid);
      const vertices = C_Collider.vertices[index];
      const [bodyEid] = getRelationTargets(world, eid, R_ChildColliderOf);
      const bodyHandle = C_Body.handle[bodyEid];

      if (!bodyHandle) {
        throw new Error(`${C_Body.name} component not initialized for ${bodyEid}`);
      }

      const body = world.physicsWorld.getRigidBody(bodyHandle);
      const verticesAsFloat32Array = new Float32Array(vertices);
      const colliderDescriptor = ColliderDesc.convexHull(verticesAsFloat32Array);

      if (colliderDescriptor) {
        const collider = world.physicsWorld.createCollider(colliderDescriptor, body);

        C_Collider.handle[index] = collider.handle;
      } else {
        throw new Error(`Cannot create collider from vertices ${JSON.stringify(vertices)}`);
      }
    }),
    observe(world, onRemove(C_Collider, R_ChildColliderOf("*")), eid => {
      const index = world.getIndex(eid);
      const colliderHandle = C_Collider.handle[index];
      const collider = world.physicsWorld.getCollider(colliderHandle);

      world.physicsWorld.removeCollider(collider, true);
    }),
  ];
}