import { RigidBodyDesc } from '@dimforge/rapier2d';
import { addComponent, query, Not } from 'bitecs';
import { n_c_body } from '../components/n_c_body';
import { n_c_physicsBody } from '../components/n_c_physicsBody';
import { n_c_position } from '../components/n_c_position';
import { n_c_rotation } from '../components/n_c_rotation';
import { E_BodyType_Dynamic, E_BodyType_Fixed, E_BodyType_Kinematic } from '../constants';
import { IEcsWorld } from '../models';
import { GetIndexToken } from '../services/getIndexToken';
import { getService } from '../services/getService';
import { PhysicsToken } from '../services/physicsToken';
import { PhysicsEntitiesToken } from '../services/physicsEntitiesToken';

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

/** Creates Rapier RigidBody for entities that need physics bodies */
export function n_s_tick_syncBodies(world: IEcsWorld) {
  const physicsWorld = getService(world, PhysicsToken);
  const physicsEntities = getService(world, PhysicsEntitiesToken);
  const getIndex = getService(world, GetIndexToken);

  const entities = query(world, [n_c_position, n_c_rotation, n_c_body, Not(n_c_physicsBody)]);

  for (let i = 0; i < entities.length; i++) {
    const eid = entities[i];
    const index = getIndex(eid);
    const type = n_c_body.type[index];

    const px = n_c_position.x[index];
    const py = n_c_position.y[index];
    const angle = n_c_rotation.angle[index];

    const bodyDescriptor = bodyTypeToBodyDescriptor(type)
      .setTranslation(px, py)
      .setRotation(angle);

    if (type === E_BodyType_Dynamic) {
      bodyDescriptor.setLinearDamping(0.5);
      bodyDescriptor.setAngularDamping(2.0);
    }

    const body = physicsWorld.createRigidBody(bodyDescriptor);

    body.userData = eid;

    n_c_physicsBody.handle[index] = body.handle;

    addComponent(world, eid, n_c_physicsBody);

    physicsEntities.add(eid, body.handle);
  }
}
