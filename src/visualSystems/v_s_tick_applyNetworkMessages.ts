import { MSG_DELTA, MSG_SNAPSHOT } from '../constants';
import type { IEcsWorld } from '../models';
import { DeserializeContextToken } from '../services/deserializeContextToken';
import { getService } from '../services/getService';
import { MessageQueueToken } from '../services/messageQueueToken';
import { unpackDelta, unpackSnapshot } from '../transport/frameDelta';

/** Drains the message queue and applies deserialization in correct order per frame */
export function v_s_tick_applyNetworkMessages(world: IEcsWorld) {
  const queue = getService(world, MessageQueueToken);
  const ctx = getService(world, DeserializeContextToken);

  const messages = queue.drain();

  for (let i = 0; i < messages.length; i++) {
    const { messageId, data } = messages[i];

    if (messageId === MSG_SNAPSHOT) {
      const unpacked = unpackSnapshot(data);

      ctx.snapshotFrame = unpacked.frame;
      ctx.snapshotDeserialize(unpacked.snapshot);
    } else if (messageId === MSG_DELTA) {
      const { frame, observer, soa } = unpackDelta(data);

      if (frame <= ctx.snapshotFrame) {
        continue;
      }

      ctx.observerDeserialize(observer);
      ctx.soaDeserialize(soa);
    }
  }
}
