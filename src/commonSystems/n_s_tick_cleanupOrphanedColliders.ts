import { query } from 'bitecs';
import { n_c_physicsCollider } from '../components/n_c_physicsCollider';
import { IEcsWorld } from '../models';
import { getService } from '../services/getService';
import { PhysicsToken } from '../services/physicsToken';
import { PhysicsCollidersToken } from '../services/physicsCollidersToken';

/** Removes Rapier colliders whose entities no longer exist or parent body was removed */
export function n_s_tick_cleanupOrphanedColliders(world: IEcsWorld) {
  const physicsWorld = getService(world, PhysicsToken);
  const physicsColliders = getService(world, PhysicsCollidersToken);

  const entities = query(world, [n_c_physicsCollider]);

  if (entities.length >= physicsColliders.size) {
    return;
  }

  const currentEntities = new Set(entities);

  for (const eid of physicsColliders.values()) {
    if (!currentEntities.has(eid)) {
      const handle = physicsColliders.getHandle(eid);

      if (handle !== undefined) {
        const collider = physicsWorld.getCollider(handle);

        if (collider) {
          physicsWorld.removeCollider(collider, true);
        }
      }

      physicsColliders.remove(eid);
    }
  }
}
