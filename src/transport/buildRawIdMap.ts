const ENTITY_MASK = (1 << 20) - 1;

/** Converts a versioned idMap (from observer deserializer) to raw-slot idMap (for SoA deserializer) */
export function buildRawIdMap(observerIdMap: Map<number, number>): Map<number, number> {
  const raw = new Map<number, number>();

  for (const [src, tgt] of observerIdMap) {
    raw.set(src & ENTITY_MASK, tgt & ENTITY_MASK);
  }

  return raw;
}
