import { INPUT_LEFT, INPUT_RIGHT } from '../constants';
import type { IEcsWorld } from '../models';
import { GetIndexToken } from '../services/getIndexToken';
import { getService } from '../services/getService';
import { PhysicsToken } from '../services/physicsToken';
import { PlayerRegistryToken } from '../services/playerRegistryToken';
import { n_c_physicsBody } from '../components/n_c_physicsBody';

const MAX_SPEED = 4;
const MAX_ANGVEL = 6;
const IMPULSE_X = 0.2;
const TORQUE_IMPULSE = 0.1;

/** Applies user input forces to player bodies */
export function l_s_tick_applyUserInput(world: IEcsWorld) {
  const physicsWorld = getService(world, PhysicsToken);
  const registry = getService(world, PlayerRegistryToken);
  const getIndex = getService(world, GetIndexToken);

  const players = registry.getPlayers();

  for (let i = 0; i < players.length; i++) {
    const [, eid, input] = players[i];
    const index = getIndex(eid);
    const handle = n_c_physicsBody.handle[index];
    const body = physicsWorld.getRigidBody(handle);

    if (!body) {
      continue;
    }

    const vel = body.linvel();
    const angvel = body.angvel();

    if (input & INPUT_LEFT) {
      if (vel.x > -MAX_SPEED) {
        body.applyImpulse({ x: -IMPULSE_X, y: 0 }, true);
      }

      if (angvel > -MAX_ANGVEL) {
        body.applyTorqueImpulse(-TORQUE_IMPULSE, true);
      }
    }

    if (input & INPUT_RIGHT) {
      if (vel.x < MAX_SPEED) {
        body.applyImpulse({ x: IMPULSE_X, y: 0 }, true);
      }

      if (angvel < MAX_ANGVEL) {
        body.applyTorqueImpulse(TORQUE_IMPULSE, true);
      }
    }
  }
}
