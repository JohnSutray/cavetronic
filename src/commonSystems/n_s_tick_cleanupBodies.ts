import { query, Not } from 'bitecs';
import { n_c_body } from '../components/n_c_body';
import { n_c_physicsBody } from '../components/n_c_physicsBody';
import { IEcsWorld } from '../models';
import { GetIndexToken } from '../services/getIndexToken';
import { getService } from '../services/getService';
import { PhysicsToken } from '../services/physicsToken';
import { PhysicsEntitiesToken } from '../services/physicsEntitiesToken';

/** Removes Rapier RigidBody for entities that no longer have n_c_body */
export function n_s_tick_cleanupBodies(world: IEcsWorld) {
  const physicsWorld = getService(world, PhysicsToken);
  const physicsEntities = getService(world, PhysicsEntitiesToken);
  const getIndex = getService(world, GetIndexToken);

  const entities = query(world, [n_c_physicsBody, Not(n_c_body)]);

  for (let i = 0; i < entities.length; i++) {
    const eid = entities[i];
    const index = getIndex(eid);
    const handle = n_c_physicsBody.handle[index];
    const body = physicsWorld.getRigidBody(handle);

    if (body) {
      physicsWorld.removeRigidBody(body);
      n_c_physicsBody.handle[index] = 0;
      physicsEntities.remove(eid);
    }
  }
}
