import { World as PhysicsWorld } from "@dimforge/rapier2d";

export interface IPhysicsWorld extends PhysicsWorld {
}

export interface IWithPhysicsWorld {
  readonly physicsWorld: IPhysicsWorld;
  getIndex(eid: number): number;
}

export interface IEcsWorld extends IWithPhysicsWorld {
}