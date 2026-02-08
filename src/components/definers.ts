const WORLD_CAPACITY = 100_000;

export const floatContainer = () => new Float32Array(WORLD_CAPACITY);
export const enumContainer = () => new Uint8Array(WORLD_CAPACITY);
export const idContainer = () => new Uint32Array(WORLD_CAPACITY);
