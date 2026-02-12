import type { World } from '@dimforge/rapier2d';
import { createToken } from './createToken';

export const PhysicsToken = createToken<World>('PhysicsWorld');
