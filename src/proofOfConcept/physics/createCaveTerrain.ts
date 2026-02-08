import { ColliderDesc, RigidBodyDesc, World } from "@dimforge/rapier2d";

const TERRAIN_POLYGONS: Float32Array[] = [
  new Float32Array([-12, 6, -4, 6, -4, 7, -12, 7]),
  new Float32Array([-4, 6, -1, 5, -1, 6, -4, 7]),
  new Float32Array([-1, 5, 3, 5, 3, 6, -1, 6]),
  new Float32Array([3, 5, 6, 3, 7, 3, 4, 5]),
  new Float32Array([6, 3, 10, 3, 10, 4, 6, 4]),
  new Float32Array([10, 3, 12, 1, 13, 1, 11, 3]),
  new Float32Array([12, 1, 16, 0, 16, 1, 12, 2]),
  new Float32Array([16, 0, 18, 1, 20, -1, 20, 0, 18, 2, 16, 1]),
  new Float32Array([20, -1, 23, -3, 24, -3, 21, -1]),
  new Float32Array([23, -3, 28, -3, 28, -2, 23, -2]),
];

export function createCaveTerrain(world: World) {
  TERRAIN_POLYGONS.forEach((vertices) => {
    const body = world.createRigidBody(RigidBodyDesc.fixed());
    const collider = ColliderDesc.convexHull(vertices);

    if (collider) {
      collider.setFriction(1.0).setRestitution(0.0);
      world.createCollider(collider, body);
    }
  });
}