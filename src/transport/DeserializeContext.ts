import {
  createObserverDeserializer,
  createSoADeserializer,
  createSnapshotDeserializer,
} from 'bitecs/serialization';
import { n_c_networked } from '../components/n_c_networked';
import { OBSERVER_COMPONENTS, SOA_COMPONENTS } from '../components/networkComponents';
import { buildRawIdMap } from './buildRawIdMap';
import type { IEcsWorld } from '../models';

/** All deserializers for VECS to receive data from LECS */
export class DeserializeContext {
  snapshotFrame = -1;

  private readonly idMap = new Map<number, number>();
  private readonly observerDeserializeRaw: (buffer: ArrayBuffer) => void;
  private readonly soaDeserializeRaw: (buffer: ArrayBuffer, idMap: Map<number, number>) => void;
  private readonly snapshotDeserializeRaw: (buffer: ArrayBuffer, idMap: Map<number, number>) => void;

  constructor(world: IEcsWorld) {
    this.observerDeserializeRaw = createObserverDeserializer(
      world,
      n_c_networked,
      OBSERVER_COMPONENTS,
      { idMap: this.idMap },
    );

    this.soaDeserializeRaw = createSoADeserializer(SOA_COMPONENTS, { diff: true });
    this.snapshotDeserializeRaw = createSnapshotDeserializer(world, SOA_COMPONENTS);
  }

  observerDeserialize(buffer: ArrayBuffer) {
    this.observerDeserializeRaw(buffer);
  }

  soaDeserialize(buffer: ArrayBuffer) {
    const rawIdMap = buildRawIdMap(this.idMap);

    this.soaDeserializeRaw(buffer, rawIdMap);
  }

  snapshotDeserialize(buffer: ArrayBuffer) {
    const rawIdMap = buildRawIdMap(this.idMap);

    this.snapshotDeserializeRaw(buffer, rawIdMap);
  }
}
