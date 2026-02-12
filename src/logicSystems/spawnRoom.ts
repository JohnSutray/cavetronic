import { addComponent } from 'bitecs';
import { n_c_body } from '../components/n_c_body';
import { n_c_collider } from '../components/n_c_collider';
import { n_c_networked } from '../components/n_c_networked';
import { n_c_position } from '../components/n_c_position';
import { n_c_rotation } from '../components/n_c_rotation';
import { E_BodyType_Fixed } from '../constants';
import type { IEcsWorld } from '../models';
import { GetIndexToken } from '../services/getIndexToken';
import { getService } from '../services/getService';
import { createEntity } from '../utils/createEntity';

const ROOM_SHAPES: number[][] = [
  [-15, 10, 15, 10, 15, 11, -15, 11],
  [-15, -6, 15, -6, 15, -5, -15, -5],
  [-16, -6, -15, -6, -15, 11, -16, 11],
  [15, -6, 16, -6, 16, 11, 15, 11],
  [-6, 5, 0, 5, 0, 5.5, -6, 5.5],
  [3, 2, 9, 2, 9, 2.5, 3, 2.5],
];

/** Spawns static room geometry as flat entities */
export function spawnRoom(world: IEcsWorld) {
  const getIndex = getService(world, GetIndexToken);

  for (let i = 0; i < ROOM_SHAPES.length; i++) {
    const eid = createEntity(world);
    const index = getIndex(eid);

    n_c_position.x[index] = 0;
    n_c_position.y[index] = 0;
    n_c_rotation.angle[index] = 0;
    n_c_body.type[index] = E_BodyType_Fixed;
    n_c_collider.vertices[index] = ROOM_SHAPES[i];

    addComponent(world, eid, n_c_networked);
    addComponent(world, eid, n_c_position);
    addComponent(world, eid, n_c_rotation);
    addComponent(world, eid, n_c_body);
    addComponent(world, eid, n_c_collider);
  }
}
