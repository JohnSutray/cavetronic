import { createToken } from './createToken';

export class PlayerRegistry {
  private players = new Map<string, { eid: number; input: number }>();

  registerPlayer(userId: string, eid: number) {
    this.players.set(userId, { eid, input: 0 });
  }

  setInput(userId: string, bitmask: number) {
    const entry = this.players.get(userId);

    if (entry) {
      entry.input = bitmask;
    }
  }

  unregisterPlayer(userId: string) {
    this.players.delete(userId);
  }

  getPlayers(): Array<[string, number, number]> {
    const result: Array<[string, number, number]> = [];

    for (const [userId, { eid, input }] of this.players) {
      result.push([userId, eid, input]);
    }

    return result;
  }
}

export const PlayerRegistryToken = createToken<PlayerRegistry>('PlayerRegistry');
