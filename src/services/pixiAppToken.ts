import type { Application } from 'pixi.js';
import { createToken } from './createToken';

export const PixiAppToken = createToken<Application>('PixiApp');
