type ConnectionEvent = {
  userId: string;
  type: 'connect' | 'disconnect';
};

/** Queue for buffering connection/disconnection events from transport */
export class ConnectionQueue {
  private queue: ConnectionEvent[] = [];

  pushConnect(userId: string) {
    this.queue.push({ userId, type: 'connect' });
  }

  pushDisconnect(userId: string) {
    this.queue.push({ userId, type: 'disconnect' });
  }

  drain(): ConnectionEvent[] {
    const events = this.queue;
    this.queue = [];

    return events;
  }
}
