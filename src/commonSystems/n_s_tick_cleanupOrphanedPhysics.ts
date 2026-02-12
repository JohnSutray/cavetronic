import { query } from 'bitecs';
import { n_c_physicsBody } from '../components/n_c_physicsBody';
import { IEcsWorld } from '../models';
import { getService } from '../services/getService';
import { PhysicsToken } from '../services/physicsToken';
import { PhysicsEntitiesToken } from '../services/physicsEntitiesToken';

/** Removes Rapier objects whose entities no longer exist in ECS world */
export function n_s_tick_cleanupOrphanedPhysics(world: IEcsWorld) {
  const physicsWorld = getService(world, PhysicsToken);
  const physicsEntities = getService(world, PhysicsEntitiesToken);

  const entities = query(world, [n_c_physicsBody]);

  if (entities.length >= physicsEntities.size) {
    return;
  }

  const currentEntities = new Set(entities);

  for (const eid of physicsEntities.values()) {
    if (!currentEntities.has(eid)) {
      const handle = physicsEntities.getHandle(eid);

      if (handle !== undefined) {
        const body = physicsWorld.getRigidBody(handle);

        if (body) {
          physicsWorld.removeRigidBody(body);
        }
      }

      physicsEntities.remove(eid);
    }
  }
}
