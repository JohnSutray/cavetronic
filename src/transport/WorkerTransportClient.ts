import { ITransport, IMessageHandler } from '../models';

/** Transport on the main thread side (VECS), wrapping a Worker instance */
export class WorkerTransportClient implements ITransport {
  private handlers = new Set<IMessageHandler>();
  private handleMessage: (event: MessageEvent) => void;

  constructor(private worker: Worker) {
    this.handleMessage = (event: MessageEvent<{ messageId: number; data: ArrayBuffer }>) => {
      const { messageId, data } = event.data;

      for (const handler of this.handlers) {
        handler(messageId, data);
      }
    };

    worker.addEventListener('message', this.handleMessage);
  }

  send(messageId: number, data: ArrayBuffer) {
    this.worker.postMessage({ messageId, data }, [data]);
  }

  onMessage(handler: IMessageHandler) {
    this.handlers.add(handler);

    return () => {
      this.handlers.delete(handler);
    };
  }

  destroy() {
    this.worker.removeEventListener('message', this.handleMessage);
    this.handlers.clear();
  }
}
