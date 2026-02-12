import type { ServiceContainer } from './services/getService';

export interface IEcsWorld {
  services: ServiceContainer;
}

export interface ITickSystem {
  (world: IEcsWorld): void;
}

export interface IMessageHandler {
  (messageId: number, data: ArrayBuffer): void;
}

export interface ITransport {
  send(messageId: number, data: ArrayBuffer): void;

  onMessage(handler: IMessageHandler): () => void;

  destroy(): void;
}

export interface IHostMessageHandler {
  (userId: string, messageId: number, data: ArrayBuffer): void;
}

export interface IHostConnectionHandler {
  (userId: string): void;
}

export interface IHostTransport {
  send(userId: string, messageId: number, data: ArrayBuffer): void;

  broadcast(messageId: number, data: ArrayBuffer): void;

  onMessage(handler: IHostMessageHandler): () => void;

  onConnect(handler: IHostConnectionHandler): () => void;

  onDisconnect(handler: IHostConnectionHandler): () => void;

  destroy(): void;
}
