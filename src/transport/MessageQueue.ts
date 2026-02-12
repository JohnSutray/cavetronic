export interface QueuedMessage {
  messageId: number;
  data: ArrayBuffer;
}

/** FIFO buffer for incoming transport messages */
export class MessageQueue {
  private queue: QueuedMessage[] = [];

  push(messageId: number, data: ArrayBuffer) {
    this.queue.push({ messageId, data });
  }

  drain(): QueuedMessage[] {
    const result = this.queue;
    this.queue = [];

    return result;
  }
}
