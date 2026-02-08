import { RigidBodyDesc } from '@dimforge/rapier2d';
import { observe, onAdd } from 'bitecs';
import { n_c_body } from '../components/n_c_body';
import { n_c_position } from '../components/n_c_position';
import { n_c_rotation } from '../components/n_c_rotation';
import { E_BodyType_Dynamic, E_BodyType_Fixed, E_BodyType_Kinematic } from '../constants';
import { IEcsWorld } from '../models';

function bodyTypeToBodyDescriptor(type: number) {
  if (type === E_BodyType_Dynamic) {
    return RigidBodyDesc.dynamic();
  }

  if (type === E_BodyType_Fixed) {
    return RigidBodyDesc.fixed();
  }

  if (type === E_BodyType_Kinematic) {
    return RigidBodyDesc.kinematicPositionBased();
  }

  throw new Error(`Unknown body type ${type}`);
}

export function s_sub_bodyAddSystem(world: IEcsWorld) {
  return observe(world, onAdd(n_c_position, n_c_rotation, n_c_body), eid => {
    const index = world.getIndex(eid);
    const type = n_c_body.type[index];
    const handle = n_c_body.handle[index];

    if (handle) {
      const body = world.physicsWorld.getRigidBody(handle);

      if (body) {
        body.userData = eid;

        return;
      }
    }

    const bodyDescriptor = bodyTypeToBodyDescriptor(type);

    const body = world.physicsWorld.createRigidBody(bodyDescriptor);

    body.userData = eid;
  });
}
