import { IHostTransport } from '../models';
import { createToken } from './createToken';

export const HostTransportToken = createToken<IHostTransport>('HostTransport');
