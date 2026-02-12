import { ColliderDesc } from '@dimforge/rapier2d';
import { addComponent, query, Not, getId } from 'bitecs';
import { n_c_collider } from '../components/n_c_collider';
import { n_c_physicsBody } from '../components/n_c_physicsBody';
import { n_c_physicsCollider } from '../components/n_c_physicsCollider';
import { IEcsWorld } from '../models';
import { GetIndexToken } from '../services/getIndexToken';
import { getService } from '../services/getService';
import { PhysicsToken } from '../services/physicsToken';
import { PhysicsCollidersToken } from '../services/physicsCollidersToken';

/** Creates Rapier colliders for flat entities that have both body and collider on the same entity */
export function n_s_tick_syncInlineColliders(world: IEcsWorld) {
  const physicsWorld = getService(world, PhysicsToken);
  const physicsColliders = getService(world, PhysicsCollidersToken);
  const getIndex = getService(world, GetIndexToken);

  const entities = query(world, [n_c_physicsBody, n_c_collider, Not(n_c_physicsCollider)]);

  for (let i = 0; i < entities.length; i++) {
    const eid = entities[i];
    const index = getIndex(eid);
    const vertices = n_c_collider.vertices[index];
    const bodyHandle = n_c_physicsBody.handle[index];

    if (!bodyHandle) {
      debugger;

      throw new Error(`n_c_physicsBody handle not set for eid ${eid}`);
    }

    const body = physicsWorld.getRigidBody(bodyHandle);
    const verticesAsFloat32Array = new Float32Array(vertices);
    const colliderDescriptor = ColliderDesc.convexHull(verticesAsFloat32Array);

    if (!colliderDescriptor) {
      throw new Error(`Cannot create collider from vertices`);
    }

    colliderDescriptor.setFriction(1.0);
    colliderDescriptor.setRestitution(0.0);

    try {
      const collider = physicsWorld.createCollider(colliderDescriptor, body);

      n_c_physicsCollider.handle[index] = collider.handle;
      addComponent(world, eid, n_c_physicsCollider);

      physicsColliders.add(eid, collider.handle);
    } catch (error) {
      debugger;
    }
  }
}
