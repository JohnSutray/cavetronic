import { INPUT_LEFT, INPUT_RIGHT, MSG_USER_INPUT } from '../constants';
import type { IEcsWorld } from '../models';
import { getService } from '../services/getService';
import { TransportToken } from '../services/transportToken';

const keys: Record<string, boolean> = {};

let listenersAttached = false;

function attachListeners() {
  if (listenersAttached) {
    return;
  }

  listenersAttached = true;

  document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
  });

  document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
  });
}

/** Reads keyboard state and sends input bitmask to the server each tick */
export function v_s_tick_sendUserInput(world: IEcsWorld) {
  attachListeners();

  const transport = getService(world, TransportToken);

  let bitmask = 0;

  if (keys['KeyA'] || keys['ArrowLeft']) {
    bitmask |= INPUT_LEFT;
  }

  if (keys['KeyD'] || keys['ArrowRight']) {
    bitmask |= INPUT_RIGHT;
  }

  const data = new Uint8Array([bitmask]);

  transport.send(MSG_USER_INPUT, data.buffer);
}
