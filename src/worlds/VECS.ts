import type { World } from "@dimforge/rapier2d";
import type { Application } from "pixi.js";
import { n_s_tick_cleanupBodies } from "../commonSystems/n_s_tick_cleanupBodies";
import { n_s_tick_cleanupColliders } from "../commonSystems/n_s_tick_cleanupColliders";
import { n_s_tick_cleanupOrphanedColliders } from "../commonSystems/n_s_tick_cleanupOrphanedColliders";
import { n_s_tick_cleanupOrphanedPhysics } from "../commonSystems/n_s_tick_cleanupOrphanedPhysics";
import { n_s_tick_syncBodies } from '../commonSystems/n_s_tick_syncBodies';
import { n_s_tick_syncColliders } from '../commonSystems/n_s_tick_syncColliders';
import { n_s_tick_syncInlineColliders } from "../commonSystems/n_s_tick_syncInlineColliders";
import { ITransport } from '../models';
import { v_s_tick_applyNetworkMessages } from "../visualSystems/v_s_tick_applyNetworkMessages";
import { v_s_tick_syncPhysicsBodies } from "../visualSystems/v_s_tick_syncPhysicsBodies";
import { v_s_tick_syncPhysicsColliders } from "../visualSystems/v_s_tick_syncPhysicsColliders";
import { v_s_tick_sendUserInput } from "../visualSystems/v_s_tick_sendUserInput";
import { v_s_tick_drawColliders } from "../visualSystems/v_s_tick_drawColliders";
import { PhysicsToken } from '../services/physicsToken';
import { PhysicsEntitiesToken, PhysicsEntitiesService } from '../services/physicsEntitiesToken';
import { PhysicsCollidersToken, PhysicsCollidersService } from '../services/physicsCollidersToken';
import { PixiAppToken } from '../services/pixiAppToken';
import { TransportToken } from '../services/transportToken';
import { DeserializeContextToken } from '../services/deserializeContextToken';
import { MessageQueueToken } from '../services/messageQueueToken';
import { DeserializeContext } from '../transport/DeserializeContext';
import { MessageQueue } from '../transport/MessageQueue';
import { createEcsWorld } from "./createEcsWorld";

export function createVecs({
  physicsWorld,
  pixiApp,
  transport,
}: {
  physicsWorld: World;
  pixiApp: Application;
  transport: ITransport;
}) {
  const messageQueue = new MessageQueue();

  const services = new Map();

  services.set(PhysicsToken, physicsWorld);
  services.set(PhysicsEntitiesToken, new PhysicsEntitiesService());
  services.set(PhysicsCollidersToken, new PhysicsCollidersService());
  services.set(PixiAppToken, pixiApp);
  services.set(TransportToken, transport);
  services.set(MessageQueueToken, messageQueue);

  const ecsWorld = createEcsWorld({
    services,
    tickSystems: [
      v_s_tick_applyNetworkMessages,
      v_s_tick_sendUserInput,

      n_s_tick_syncBodies,
      n_s_tick_syncInlineColliders,
      n_s_tick_syncColliders,

      n_s_tick_cleanupBodies,
      n_s_tick_cleanupColliders,
      n_s_tick_cleanupOrphanedPhysics,
      n_s_tick_cleanupOrphanedColliders,

      v_s_tick_drawColliders,
    ],
  });

  services.set(DeserializeContextToken, new DeserializeContext(ecsWorld.world));

  transport.onMessage((messageId, data) => messageQueue.push(messageId, data));

  return ecsWorld;
}
