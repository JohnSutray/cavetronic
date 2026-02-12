import { ColliderDesc } from '@dimforge/rapier2d';
import { addComponent, getRelationTargets, query, Not } from 'bitecs';
import { n_c_collider } from '../components/n_c_collider';
import { n_c_physicsBody } from '../components/n_c_physicsBody';
import { n_c_physicsCollider } from '../components/n_c_physicsCollider';
import { IEcsWorld } from '../models';
import { r_childColliderOf } from '../relations/r_childColliderOf';
import { GetIndexToken } from '../services/getIndexToken';
import { getService } from '../services/getService';
import { PhysicsToken } from '../services/physicsToken';
import { PhysicsCollidersToken } from '../services/physicsCollidersToken';

/** Creates Rapier Colliders for child collider entities */
export function n_s_tick_syncColliders(world: IEcsWorld) {
  const physicsWorld = getService(world, PhysicsToken);
  const physicsColliders = getService(world, PhysicsCollidersToken);
  const getIndex = getService(world, GetIndexToken);

  const entities = query(world, [n_c_collider, r_childColliderOf('*'), Not(n_c_physicsCollider)]);

  for (let i = 0; i < entities.length; i++) {
    const eid = entities[i];
    const index = getIndex(eid);
    const vertices = n_c_collider.vertices[index];
    const [bodyEid] = getRelationTargets(world, eid, r_childColliderOf);
    const bodyHandle = n_c_physicsBody.handle[bodyEid];

    if (!bodyHandle) {
      throw new Error(`n_c_physicsBody not initialized for ${bodyEid}`);
    }

    const body = physicsWorld.getRigidBody(bodyHandle);
    const verticesAsFloat32Array = new Float32Array(vertices);
    const colliderDescriptor = ColliderDesc.convexHull(verticesAsFloat32Array);

    if (colliderDescriptor) {
      const collider = physicsWorld.createCollider(colliderDescriptor, body);

      n_c_physicsCollider.handle[index] = collider.handle;
      addComponent(world, eid, n_c_physicsCollider);

      physicsColliders.add(eid, collider.handle);
    } else {
      throw new Error(`Cannot create collider from vertices ${JSON.stringify(vertices)}`);
    }
  }
}
