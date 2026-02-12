import { MSG_USER_INPUT } from '../constants';
import type { IEcsWorld } from '../models';
import { getService } from '../services/getService';
import { HostMessageQueueToken } from '../services/hostMessageQueueToken';
import { PlayerRegistryToken } from '../services/playerRegistryToken';

/** Processes incoming messages from clients */
export function l_s_tick_receiveMessages(world: IEcsWorld) {
  const messageQueue = getService(world, HostMessageQueueToken);
  const registry = getService(world, PlayerRegistryToken);

  const messages = messageQueue.drain();

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];

    if (message.messageId === MSG_USER_INPUT) {
      const bytes = new Uint8Array(message.data);

      registry.setInput(message.userId, bytes[0]);
    }
  }
}
