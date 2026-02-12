import { createToken } from './createToken';

export class PhysicsEntitiesService {
  private entities = new Set<number>();
  private handles = new Map<number, number>();

  add(eid: number, handle: number) {
    this.entities.add(eid);
    this.handles.set(eid, handle);
  }

  remove(eid: number) {
    this.entities.delete(eid);
    this.handles.delete(eid);
  }

  has(eid: number): boolean {
    return this.entities.has(eid);
  }

  getHandle(eid: number): number | undefined {
    return this.handles.get(eid);
  }

  get size(): number {
    return this.entities.size;
  }

  *values(): IterableIterator<number> {
    yield* this.entities.values();
  }
}

export const PhysicsEntitiesToken = createToken<PhysicsEntitiesService>('PhysicsEntities');
