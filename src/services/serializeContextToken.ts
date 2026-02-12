import type { SerializeContext } from '../transport/SerializeContext';
import { createToken } from './createToken';

export const SerializeContextToken = createToken<SerializeContext>('SerializeContext');
