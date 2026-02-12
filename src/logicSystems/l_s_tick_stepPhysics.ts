import { query } from 'bitecs';
import { n_c_physicsBody } from '../components/n_c_physicsBody';
import { n_c_position } from '../components/n_c_position';
import { n_c_rotation } from '../components/n_c_rotation';
import { n_c_body } from '../components/n_c_body';
import { E_BodyType_Dynamic } from '../constants';
import type { IEcsWorld } from '../models';
import { GetIndexToken } from '../services/getIndexToken';
import { getService } from '../services/getService';
import { PhysicsToken } from '../services/physicsToken';

/** Steps Rapier physics and syncs dynamic body positions back to ECS components */
export function l_s_tick_stepPhysics(world: IEcsWorld) {
  const physicsWorld = getService(world, PhysicsToken);
  const getIndex = getService(world, GetIndexToken);

  physicsWorld.step();

  const entities = query(world, [n_c_physicsBody, n_c_position, n_c_rotation, n_c_body]);

  for (let i = 0; i < entities.length; i++) {
    const eid = entities[i];
    const index = getIndex(eid);

    if (n_c_body.type[index] !== E_BodyType_Dynamic) {
      continue;
    }

    const body = physicsWorld.getRigidBody(n_c_physicsBody.handle[index]);

    if (!body) {
      continue;
    }

    const pos = body.translation();

    n_c_position.x[index] = pos.x;
    n_c_position.y[index] = pos.y;
    n_c_rotation.angle[index] = body.rotation();
  }
}
