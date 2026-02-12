import { n_c_body } from './n_c_body';
import { n_c_collider } from './n_c_collider';
import { n_c_position } from './n_c_position';
import { n_c_rotation } from './n_c_rotation';

export const OBSERVER_COMPONENTS = [n_c_position, n_c_rotation, n_c_body, n_c_collider];

export const SOA_COMPONENTS = [n_c_position, n_c_rotation, n_c_body, n_c_collider];
