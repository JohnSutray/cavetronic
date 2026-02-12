type HostMessage = {
  userId: string;
  messageId: number;
  data: ArrayBuffer;
};

/** Queue for buffering messages from host transport */
export class HostMessageQueue {
  private queue: HostMessage[] = [];

  push(userId: string, messageId: number, data: ArrayBuffer) {
    this.queue.push({ userId, messageId, data });
  }

  drain(): HostMessage[] {
    const messages = this.queue;
    this.queue = [];

    return messages;
  }
}
