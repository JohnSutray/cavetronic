import { spawnRoom } from '../logicSystems/spawnRoom';
import { HostTransport } from '../transport/HostTransport';
import { WorkerTransportHost } from '../transport/WorkerTransportHost';
import { createPhysicsWorld } from '../utils/createPhysicsWorld';
import { workerLoop } from '../utils/workerLoop';
import { createLecs } from '../worlds/LECS';

const STEP_MS = 8;
const LOCAL_USER_ID = 'local';

const localChannel = new WorkerTransportHost();
const transport = new HostTransport();

const physicsWorld = createPhysicsWorld();

const lecs = createLecs({
  physicsWorld,
  transport,
});

spawnRoom(lecs.world);

lecs.tick(0);
transport.addClient(LOCAL_USER_ID, localChannel);

function lecsTick(deltaTimeMs: number) {
  lecs.tick(deltaTimeMs);

  return true;
}

workerLoop(STEP_MS, lecsTick);
