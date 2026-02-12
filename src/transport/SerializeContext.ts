import { createObserverSerializer, createSnapshotSerializer, createSoASerializer } from 'bitecs/serialization';
import { n_c_networked } from '../components/n_c_networked';
import { OBSERVER_COMPONENTS, SOA_COMPONENTS } from '../components/networkComponents';
import type { IEcsWorld } from '../models';

/** All serializers for LECS → VECS transport */
export class SerializeContext {
  frame = 0;

  readonly observerSerialize: () => ArrayBuffer;
  readonly soaSerialize: (eids: number[]) => ArrayBuffer;
  readonly snapshotSerialize: () => ArrayBuffer;

  constructor(world: IEcsWorld) {
    this.observerSerialize = createObserverSerializer(world, n_c_networked, OBSERVER_COMPONENTS);
    this.soaSerialize = createSoASerializer(SOA_COMPONENTS, { diff: true });
    this.snapshotSerialize = createSnapshotSerializer(world, SOA_COMPONENTS);
  }
}
