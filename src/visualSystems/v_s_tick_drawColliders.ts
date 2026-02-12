import { Container, Graphics } from 'pixi.js';
import { query } from 'bitecs';
import { n_c_collider } from '../components/n_c_collider';
import { n_c_position } from '../components/n_c_position';
import { n_c_rotation } from '../components/n_c_rotation';
import { n_c_body } from '../components/n_c_body';
import { E_BodyType_Dynamic } from '../constants';
import type { IEcsWorld } from '../models';
import { GetIndexToken } from '../services/getIndexToken';
import { getService } from '../services/getService';
import { PixiAppToken } from '../services/pixiAppToken';

const SCALE = 20;

let container: Container | null = null;
let graphics: Graphics | null = null;

/** Draws all collider outlines as green wireframes and follows the player camera */
export function v_s_tick_drawColliders(world: IEcsWorld) {
  const pixiApp = getService(world, PixiAppToken);
  const getIndex = getService(world, GetIndexToken);

  if (!container) {
    container = new Container();
    graphics = new Graphics();
    container.addChild(graphics);
    pixiApp.stage.addChild(container);
  }

  graphics!.clear();

  const entities = query(world, [n_c_collider, n_c_position, n_c_rotation]);

  let camX = 0;
  let camY = 0;

  findCamera(entities, getIndex);

  function findCamera(eids: ArrayLike<number>, getIdx: (eid: number) => number) {
    for (let i = 0; i < eids.length; i++) {
      const idx = getIdx(eids[i]);

      if (n_c_body.type[idx] === E_BodyType_Dynamic) {
        camX = n_c_position.x[idx];
        camY = n_c_position.y[idx];

        return;
      }
    }
  }

  const screenW = pixiApp.screen.width;
  const screenH = pixiApp.screen.height;
  const offsetX = screenW / 2 - camX * SCALE;
  const offsetY = screenH / 2 - camY * SCALE;

  container!.position.set(offsetX, offsetY);
  container!.scale.set(SCALE, SCALE);

  const g = graphics!;


  for (let i = 0; i < entities.length; i++) {
    const eid = entities[i];
    const index = getIndex(eid);
    const vertices = n_c_collider.vertices[index];
    const px = n_c_position.x[index];
    const py = n_c_position.y[index];
    const rot = n_c_rotation.angle[index];

    if (!vertices || vertices.length < 4) {
      continue;
    }

    const cos = Math.cos(rot);
    const sin = Math.sin(rot);

    drawShape(g, vertices, px, py, cos, sin);
  }

  g.stroke({ color: 0x00ff00, width: 1 / SCALE });
}

function drawShape(
  g: Graphics,
  vertices: ArrayLike<number>,
  px: number,
  py: number,
  cos: number,
  sin: number,
) {
  const lx0 = vertices[0];
  const ly0 = vertices[1];

  g.moveTo(px + lx0 * cos - ly0 * sin, py + lx0 * sin + ly0 * cos);

  for (let j = 2; j < vertices.length; j += 2) {
    const lx = vertices[j];
    const ly = vertices[j + 1];

    g.lineTo(px + lx * cos - ly * sin, py + lx * sin + ly * cos);
  }

  g.closePath();
}
