import { World as PhysicsWorld } from "@dimforge/rapier2d";
import { Application } from "pixi.js";

export interface IPhysicsWorld extends PhysicsWorld {
}

export interface IWithPhysicsWorld {
  readonly physicsWorld: IPhysicsWorld;
}

export interface IWithGetIndex {
  getIndex(eid: number): number;
}

export interface IWithDeltaTime {
  deltaTimeMs: number;
}

export interface IWithPixiApp {
  readonly pixiApp: Application;
}

export interface IEcsWorld extends IWithPhysicsWorld, IWithGetIndex, IWithDeltaTime, IWithPixiApp {
}

export interface ISubscriptionSystem {
  (world: IEcsWorld): () => void;
}

export interface ITickSystem {
  (world: IEcsWorld): void;
}
