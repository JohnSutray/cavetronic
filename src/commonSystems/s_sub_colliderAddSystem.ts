import { ColliderDesc } from '@dimforge/rapier2d';
import { getRelationTargets, observe, onAdd } from 'bitecs';
import { n_c_body } from '../components/n_c_body';
import { n_c_collider } from '../components/n_c_collider';
import { IEcsWorld } from '../models';
import { r_childColliderOf } from '../relations/r_childColliderOf';

export function s_sub_colliderAddSystem(world: IEcsWorld) {
  return observe(world, onAdd(n_c_collider, r_childColliderOf('*')), eid => {
    const index = world.getIndex(eid);
    const vertices = n_c_collider.vertices[index];
    const [bodyEid] = getRelationTargets(world, eid, r_childColliderOf);
    const bodyHandle = n_c_body.handle[bodyEid];

    if (!bodyHandle) {
      throw new Error(`${n_c_body.name} component not initialized for ${bodyEid}`);
    }

    const body = world.physicsWorld.getRigidBody(bodyHandle);
    const verticesAsFloat32Array = new Float32Array(vertices);
    const colliderDescriptor = ColliderDesc.convexHull(verticesAsFloat32Array);

    if (colliderDescriptor) {
      const collider = world.physicsWorld.createCollider(colliderDescriptor, body);

      n_c_collider.handle[index] = collider.handle;
    } else {
      throw new Error(`Cannot create collider from vertices ${JSON.stringify(vertices)}`);
    }
  });
}
