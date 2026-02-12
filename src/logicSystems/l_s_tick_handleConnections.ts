import { addComponent } from 'bitecs';
import { n_c_body } from '../components/n_c_body';
import { n_c_collider } from '../components/n_c_collider';
import { n_c_networked } from '../components/n_c_networked';
import { n_c_position } from '../components/n_c_position';
import { n_c_rotation } from '../components/n_c_rotation';
import { E_BodyType_Dynamic, MSG_SNAPSHOT } from '../constants';
import type { IEcsWorld } from '../models';
import { ConnectionQueueToken } from '../services/connectionQueueToken';
import { GetIndexToken } from '../services/getIndexToken';
import { getService } from '../services/getService';
import { HostTransportToken } from '../services/hostTransportToken';
import { PlayerRegistryToken } from '../services/playerRegistryToken';
import { SerializeContextToken } from '../services/serializeContextToken';
import { packSnapshot } from '../transport/frameDelta';
import { createEntity } from '../utils/createEntity';

const HALF_SIZE = 0.4;

const PLAYER_VERTICES = [
  -HALF_SIZE, -HALF_SIZE,
  HALF_SIZE, -HALF_SIZE,
  HALF_SIZE, HALF_SIZE,
  -HALF_SIZE, HALF_SIZE,
];

/** Handles connection/disconnection events: spawns players and sends snapshots */
export function l_s_tick_handleConnections(world: IEcsWorld) {
  const connectionQueue = getService(world, ConnectionQueueToken);
  const transport = getService(world, HostTransportToken);
  const registry = getService(world, PlayerRegistryToken);
  const getIndex = getService(world, GetIndexToken);
  const ctx = getService(world, SerializeContextToken);

  const events = connectionQueue.drain();

  for (let i = 0; i < events.length; i++) {
    const event = events[i];

    if (event.type === 'connect') {
      const eid = createEntity(world);
      const index = getIndex(eid);

      n_c_position.x[index] = -8;
      n_c_position.y[index] = 8;
      n_c_rotation.angle[index] = 0;
      n_c_body.type[index] = E_BodyType_Dynamic;
      n_c_collider.vertices[index] = PLAYER_VERTICES;

      addComponent(world, eid, n_c_networked);
      addComponent(world, eid, n_c_position);
      addComponent(world, eid, n_c_rotation);
      addComponent(world, eid, n_c_body);
      addComponent(world, eid, n_c_collider);

      registry.registerPlayer(event.userId, eid);

      const snapshotBuffer = ctx.snapshotSerialize();
      const packed = packSnapshot(ctx.frame, snapshotBuffer);

      transport.send(event.userId, MSG_SNAPSHOT, packed);
    }

    if (event.type === 'disconnect') {
      registry.unregisterPlayer(event.userId);
    }
  }
}
