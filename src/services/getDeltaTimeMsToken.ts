import { createToken } from './createToken';

export const GetDeltaTimeMsToken = createToken<() => number>('GetDeltaTimeMs');
