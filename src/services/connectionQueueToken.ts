import { ConnectionQueue } from '../transport/ConnectionQueue';
import { createToken } from './createToken';

export const ConnectionQueueToken = createToken<ConnectionQueue>('ConnectionQueue');
