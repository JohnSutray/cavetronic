import { array, f32 } from 'bitecs/serialization';
import { idContainer } from './definers';

export const n_c_collider = {
  handle: idContainer(),
  vertices: array(f32),
  name: 'C_Collider',
};
