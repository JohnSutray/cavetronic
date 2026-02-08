import { ColliderDesc, JointData, RigidBodyDesc, World } from "@dimforge/rapier2d";

/**
 * Создаёт неровный объект, прикреплённый к игроку
 */
export function createAttachedObject(world: World, playerBody: any) {
  const attachedVertices = new Float32Array([
    0, 0,
    0.6, -0.2,
    0.8, 0.3,
    0.5, 0.7,
    0.1, 0.5,
  ]);

  const attachedBodyDesc = RigidBodyDesc.dynamic()
    .setTranslation(playerBody.translation().x + 0.6, playerBody.translation().y - 0.6)
    .setLinearDamping(0.5)
    .setAngularDamping(2.0);

  const attachedBody = world.createRigidBody(attachedBodyDesc);

  const attachedCollider = ColliderDesc.convexHull(attachedVertices);

  if (attachedCollider) {
    attachedCollider.setDensity(0.5).setFriction(1.0).setRestitution(0.0);
    world.createCollider(attachedCollider, attachedBody);
  }

  // Жёсткое соединение (fixed joint)
  const jointData = JointData.fixed(
    { x: 0.4, y: -0.4 },   // anchor на игроке (верхний правый угол)
    0,
    { x: 0.0, y: 0.3 },     // anchor на прикреплённом объекте
    0,
  );

  world.createImpulseJoint(jointData, playerBody, attachedBody, true);

  return attachedBody.handle;
}