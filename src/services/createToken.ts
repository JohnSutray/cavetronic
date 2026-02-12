export type ServiceToken<T> = symbol & { readonly __type?: T };

/** Creates a typed DI token backed by a unique symbol */
export function createToken<T>(name: string): ServiceToken<T> {
  return Symbol(name) as ServiceToken<T>;
}
