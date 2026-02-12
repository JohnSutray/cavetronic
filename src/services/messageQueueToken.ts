import type { MessageQueue } from '../transport/MessageQueue';
import { createToken } from './createToken';

export const MessageQueueToken = createToken<MessageQueue>('MessageQueue');
