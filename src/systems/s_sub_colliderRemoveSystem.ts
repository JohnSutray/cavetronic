import { observe, onRemove } from 'bitecs';
import { n_c_collider } from '../components/n_c_collider';
import { IEcsWorld } from '../models';
import { r_childColliderOf } from '../relations/r_childColliderOf';

export function s_sub_colliderRemoveSystem(world: IEcsWorld) {
  return observe(world, onRemove(n_c_collider, r_childColliderOf('*')), eid => {
    const index = world.getIndex(eid);
    const colliderHandle = n_c_collider.handle[index];
    const collider = world.physicsWorld.getCollider(colliderHandle);

    world.physicsWorld.removeCollider(collider, true);
  });
}
