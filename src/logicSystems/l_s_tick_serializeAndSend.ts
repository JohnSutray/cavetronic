import { query } from 'bitecs';
import { n_c_networked } from '../components/n_c_networked';
import { MSG_DELTA } from '../constants';
import type { IEcsWorld } from '../models';
import { GetIndexToken } from '../services/getIndexToken';
import { getService } from '../services/getService';
import { SerializeContextToken } from '../services/serializeContextToken';
import { HostTransportToken } from '../services/hostTransportToken';
import { packDelta } from '../transport/frameDelta';

/** Last tick system on LECS: serializes observer + SoA into one message and broadcasts via transport */
export function l_s_tick_serializeAndSend(world: IEcsWorld) {
  const transport = getService(world, HostTransportToken);
  const ctx = getService(world, SerializeContextToken);
  const getIndex = getService(world, GetIndexToken);

  ctx.frame++;

  const observerBuffer = ctx.observerSerialize();
  const networkedEids = query(world, [n_c_networked]);
  const rawIds = new Array<number>(networkedEids.length);

  for (let i = 0; i < networkedEids.length; i++) {
    rawIds[i] = getIndex(networkedEids[i]);
  }

  const soaBuffer = ctx.soaSerialize(rawIds);
  const packed = packDelta(ctx.frame, observerBuffer, soaBuffer);

  transport.broadcast(MSG_DELTA, packed);
}
