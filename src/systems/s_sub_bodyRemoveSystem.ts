import { observe, onRemove } from 'bitecs';
import { n_c_body } from '../components/n_c_body';
import { IEcsWorld } from '../models';

export function s_sub_bodyRemoveSystem(world: IEcsWorld) {
  return observe(world, onRemove(n_c_body), eid => {
    const index = world.getIndex(eid);
    const handle = n_c_body.handle[index];

    const body = world.physicsWorld.getRigidBody(handle);

    if (body) {
      world.physicsWorld.removeRigidBody(body);
      n_c_body.handle[index] = 0;
    }
  });
}
