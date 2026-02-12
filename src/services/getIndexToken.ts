import { createToken } from './createToken';

export const GetIndexToken = createToken<(eid: number) => number>('GetIndex');
