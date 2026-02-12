/** Packs delta: [Uint32 frame][Uint32 observerLen][observer][soa] */
export function packDelta(frame: number, observer: ArrayBuffer, soa: ArrayBuffer): ArrayBuffer {
  const totalLen = 8 + observer.byteLength + soa.byteLength;
  const out = new ArrayBuffer(totalLen);
  const view = new DataView(out);

  view.setUint32(0, frame, true);
  view.setUint32(4, observer.byteLength, true);

  const bytes = new Uint8Array(out);
  bytes.set(new Uint8Array(observer), 8);
  bytes.set(new Uint8Array(soa), 8 + observer.byteLength);

  return out;
}

/** Unpacks a framed delta */
export function unpackDelta(buffer: ArrayBuffer): { frame: number; observer: ArrayBuffer; soa: ArrayBuffer } {
  const view = new DataView(buffer);
  const frame = view.getUint32(0, true);
  const observerLen = view.getUint32(4, true);

  const observer = buffer.slice(8, 8 + observerLen);
  const soa = buffer.slice(8 + observerLen);

  return { frame, observer, soa };
}

/** Packs snapshot: [Uint32 frame][snapshot] */
export function packSnapshot(frame: number, snapshot: ArrayBuffer): ArrayBuffer {
  const out = new ArrayBuffer(4 + snapshot.byteLength);

  new DataView(out).setUint32(0, frame, true);
  new Uint8Array(out).set(new Uint8Array(snapshot), 4);

  return out;
}

/** Unpacks a framed snapshot */
export function unpackSnapshot(buffer: ArrayBuffer): { frame: number; snapshot: ArrayBuffer } {
  const frame = new DataView(buffer).getUint32(0, true);
  const snapshot = buffer.slice(4);

  return { frame, snapshot };
}
