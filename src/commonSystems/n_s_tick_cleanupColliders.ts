import { query, Not } from 'bitecs';
import { n_c_collider } from '../components/n_c_collider';
import { n_c_physicsCollider } from '../components/n_c_physicsCollider';
import { IEcsWorld } from '../models';
import { GetIndexToken } from '../services/getIndexToken';
import { getService } from '../services/getService';
import { PhysicsToken } from '../services/physicsToken';
import { PhysicsCollidersToken } from '../services/physicsCollidersToken';

/** Removes Rapier Colliders for entities that no longer have n_c_collider */
export function n_s_tick_cleanupColliders(world: IEcsWorld) {
  const physicsWorld = getService(world, PhysicsToken);
  const physicsColliders = getService(world, PhysicsCollidersToken);
  const getIndex = getService(world, GetIndexToken);

  const entities = query(world, [n_c_physicsCollider, Not(n_c_collider)]);

  for (let i = 0; i < entities.length; i++) {
    const eid = entities[i];
    const index = getIndex(eid);
    const colliderHandle = n_c_physicsCollider.handle[index];
    const collider = physicsWorld.getCollider(colliderHandle);

    if (collider) {
      physicsWorld.removeCollider(collider, true);
      n_c_physicsCollider.handle[index] = 0;
      physicsColliders.remove(eid);
    }
  }
}
