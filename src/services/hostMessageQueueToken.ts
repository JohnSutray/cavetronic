import { HostMessageQueue } from '../transport/HostMessageQueue';
import { createToken } from './createToken';

export const HostMessageQueueToken = createToken<HostMessageQueue>('HostMessageQueue');
