import type { IHostConnectionHandler, IHostMessageHandler, IHostTransport, ITransport } from '../models';

/** Generic multi-client host transport. Routes messages by userId via ITransport connections. */
export class HostTransport implements IHostTransport {
  private clients = new Map<string, ITransport>();
  private unsubscribes = new Map<string, () => void>();
  private messageHandlers = new Set<IHostMessageHandler>();
  private connectHandlers = new Set<IHostConnectionHandler>();
  private disconnectHandlers = new Set<IHostConnectionHandler>();

  addClient(userId: string, connection: ITransport) {
    this.clients.set(userId, connection);

    const unsub = connection.onMessage((messageId, data) => {
      for (const handler of this.messageHandlers) {
        handler(userId, messageId, data);
      }
    });

    this.unsubscribes.set(userId, unsub);

    for (const handler of this.connectHandlers) {
      handler(userId);
    }
  }

  removeClient(userId: string) {
    const unsub = this.unsubscribes.get(userId);

    if (unsub) {
      unsub();
      this.unsubscribes.delete(userId);
    }

    const client = this.clients.get(userId);

    if (!client) {
      return;
    }

    this.clients.delete(userId);

    for (const handler of this.disconnectHandlers) {
      handler(userId);
    }

    client.destroy();
  }

  send(userId: string, messageId: number, data: ArrayBuffer) {
    const client = this.clients.get(userId);

    if (client) {
      client.send(messageId, data);
    }
  }

  broadcast(messageId: number, data: ArrayBuffer) {
    for (const client of this.clients.values()) {
      client.send(messageId, data.slice(0));
    }
  }

  onMessage(handler: IHostMessageHandler) {
    this.messageHandlers.add(handler);

    return () => {
      this.messageHandlers.delete(handler);
    };
  }

  onConnect(handler: IHostConnectionHandler) {
    this.connectHandlers.add(handler);

    return () => {
      this.connectHandlers.delete(handler);
    };
  }

  onDisconnect(handler: IHostConnectionHandler) {
    this.disconnectHandlers.add(handler);

    return () => {
      this.disconnectHandlers.delete(handler);
    };
  }

  destroy() {
    for (const userId of Array.from(this.clients.keys())) {
      this.removeClient(userId);
    }

    this.messageHandlers.clear();
    this.connectHandlers.clear();
    this.disconnectHandlers.clear();
  }
}
