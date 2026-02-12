import type { DeserializeContext } from '../transport/DeserializeContext';
import { createToken } from './createToken';

export const DeserializeContextToken = createToken<DeserializeContext>('DeserializeContext');
