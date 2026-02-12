import { ITransport } from '../models';
import { createToken } from './createToken';

export const TransportToken = createToken<ITransport>('Transport');
