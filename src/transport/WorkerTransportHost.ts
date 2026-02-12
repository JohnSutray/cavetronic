import type { ITransport, IMessageHandler } from '../models';

declare const self: Worker;

/** Worker-side transport channel to main thread via postMessage */
export class WorkerTransportHost implements ITransport {
  private handlers = new Set<IMessageHandler>();
  private handleMessage: (event: MessageEvent) => void;

  constructor() {
    this.handleMessage = (event: MessageEvent<{ messageId: number; data: ArrayBuffer }>) => {
      const { messageId, data } = event.data;

      for (const handler of this.handlers) {
        handler(messageId, data);
      }
    };

    self.addEventListener('message', this.handleMessage);
  }

  send(messageId: number, data: ArrayBuffer) {
    self.postMessage({ messageId, data }, [data]);
  }

  onMessage(handler: IMessageHandler) {
    this.handlers.add(handler);

    return () => {
      this.handlers.delete(handler);
    };
  }

  destroy() {
    self.removeEventListener('message', this.handleMessage);
    this.handlers.clear();
  }
}
