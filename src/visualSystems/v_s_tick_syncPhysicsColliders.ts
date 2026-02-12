import { ColliderDesc } from '@dimforge/rapier2d';
import { addComponent, getRelationTargets, query, Not } from 'bitecs';
import { n_c_collider } from '../components/n_c_collider';
import { n_c_physicsBody } from '../components/n_c_physicsBody';
import { n_c_physicsCollider } from '../components/n_c_physicsCollider';
import type { IEcsWorld } from '../models';
import { r_childColliderOf } from '../relations/r_childColliderOf';
import { GetIndexToken } from '../services/getIndexToken';
import { getService } from '../services/getService';
import { PhysicsToken } from '../services/physicsToken';
import { PhysicsCollidersToken } from '../services/physicsCollidersToken';

/** Creates Rapier colliders for entities that have n_c_collider but no n_c_physicsCollider yet */
export function v_s_tick_syncPhysicsColliders(world: IEcsWorld) {
  const physicsWorld = getService(world, PhysicsToken);
  const physicsColliders = getService(world, PhysicsCollidersToken);
  const getIndex = getService(world, GetIndexToken);

  const entities = query(world, [n_c_collider, r_childColliderOf('*'), Not(n_c_physicsCollider)]);

  for (let i = 0; i < entities.length; i++) {
    const eid = entities[i];
    const index = getIndex(eid);
    const vertices = n_c_collider.vertices[index];
    const [bodyEid] = getRelationTargets(world, eid, r_childColliderOf);

    if (!bodyEid) {
      continue;
    }

    const bodyIndex = getIndex(bodyEid);
    const bodyHandle = n_c_physicsBody.handle[bodyIndex];

    if (!bodyHandle) {
      continue;
    }

    const body = physicsWorld.getRigidBody(bodyHandle);
    const verticesAsFloat32Array = new Float32Array(vertices);
    const colliderDescriptor = ColliderDesc.convexHull(verticesAsFloat32Array);

    if (colliderDescriptor) {
      const collider = physicsWorld.createCollider(colliderDescriptor, body);

      n_c_physicsCollider.handle[index] = collider.handle;

      addComponent(world, eid, n_c_physicsCollider);

      physicsColliders.add(eid, collider.handle);
    }
  }
}
