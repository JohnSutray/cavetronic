import type { ServiceToken } from "./createToken";

export type ServiceContainer = Map<ServiceToken<unknown>, unknown>;

/** Retrieves a typed service from the world's service container */
export function getService<T>(world: { services: ServiceContainer }, token: ServiceToken<T>): T {
  const service = world.services.get(token);

  if (service === undefined) {
    throw new Error(`Service not found: ${String(token)}`);
  }

  return service as T;
}
