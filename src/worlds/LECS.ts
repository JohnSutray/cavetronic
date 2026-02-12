import type { World } from "@dimforge/rapier2d";
import { observe, onAdd } from 'bitecs';
import { n_s_tick_cleanupBodies } from "../commonSystems/n_s_tick_cleanupBodies";
import { n_s_tick_cleanupColliders } from "../commonSystems/n_s_tick_cleanupColliders";
import { n_s_tick_cleanupOrphanedColliders } from "../commonSystems/n_s_tick_cleanupOrphanedColliders";
import { n_s_tick_cleanupOrphanedPhysics } from "../commonSystems/n_s_tick_cleanupOrphanedPhysics";
import { n_s_tick_syncBodies } from "../commonSystems/n_s_tick_syncBodies";
import { n_s_tick_syncColliders } from "../commonSystems/n_s_tick_syncColliders";
import { n_s_tick_syncInlineColliders } from "../commonSystems/n_s_tick_syncInlineColliders";
import { n_c_collider } from '../components/n_c_collider';
import { l_s_tick_applyUserInput } from "../logicSystems/l_s_tick_applyUserInput";
import { l_s_tick_handleConnections } from "../logicSystems/l_s_tick_handleConnections";
import { l_s_tick_receiveMessages } from "../logicSystems/l_s_tick_receiveMessages";
import { l_s_tick_stepPhysics } from "../logicSystems/l_s_tick_stepPhysics";
import { l_s_tick_serializeAndSend } from "../logicSystems/l_s_tick_serializeAndSend";
import { IHostTransport } from '../models';
import { PhysicsToken } from '../services/physicsToken';
import { PhysicsEntitiesToken, PhysicsEntitiesService } from '../services/physicsEntitiesToken';
import { PhysicsCollidersToken, PhysicsCollidersService } from '../services/physicsCollidersToken';
import { HostTransportToken } from '../services/hostTransportToken';
import { SerializeContextToken } from '../services/serializeContextToken';
import { PlayerRegistryToken, PlayerRegistry } from '../services/playerRegistryToken';
import { ConnectionQueueToken } from '../services/connectionQueueToken';
import { HostMessageQueueToken } from '../services/hostMessageQueueToken';
import { SerializeContext } from '../transport/SerializeContext';
import { ConnectionQueue } from '../transport/ConnectionQueue';
import { HostMessageQueue } from '../transport/HostMessageQueue';
import { createEcsWorld } from "./createEcsWorld";

export function createLecs({ physicsWorld, transport }: { physicsWorld: World; transport: IHostTransport }) {
  const connectionQueue = new ConnectionQueue();
  const hostMessageQueue = new HostMessageQueue();

  const services = new Map();
  services.set(PhysicsToken, physicsWorld);
  services.set(PhysicsEntitiesToken, new PhysicsEntitiesService());
  services.set(PhysicsCollidersToken, new PhysicsCollidersService());
  services.set(HostTransportToken, transport);
  services.set(PlayerRegistryToken, new PlayerRegistry());
  services.set(ConnectionQueueToken, connectionQueue);
  services.set(HostMessageQueueToken, hostMessageQueue);

  const ecsWorld = createEcsWorld({
    services,
    tickSystems: [
      l_s_tick_handleConnections,
      l_s_tick_receiveMessages,

      n_s_tick_syncBodies,
      n_s_tick_syncInlineColliders,
      n_s_tick_syncColliders,

      l_s_tick_applyUserInput,

      l_s_tick_stepPhysics,

      n_s_tick_cleanupBodies,
      n_s_tick_cleanupColliders,
      n_s_tick_cleanupOrphanedPhysics,
      n_s_tick_cleanupOrphanedColliders,

      l_s_tick_serializeAndSend,
    ],
  });

  observe(ecsWorld.world, onAdd(n_c_collider), eid => {
    debugger;
  })

  services.set(SerializeContextToken, new SerializeContext(ecsWorld.world));

  transport.onConnect((userId) => connectionQueue.pushConnect(userId));
  transport.onDisconnect((userId) => connectionQueue.pushDisconnect(userId));
  transport.onMessage((userId, messageId, data) => hostMessageQueue.push(userId, messageId, data));

  return ecsWorld;
}
