import ListMemoryStorage from "@list/access";

type Resolver = (value: string) => void;

export class AsyncSignalQueue {
  private resolvers: Map<string, Resolver[]>;

  constructor() {
    this.resolvers = new Map();
  }

  wait(key: string): Promise<string> {
    return new Promise((resolve) => {
      const resolvers = this.resolvers.get(key);
      if (!resolvers) {
        this.resolvers.set(key, [resolve]);
        return;
      }
      resolvers.unshift(resolve);
      this.resolvers.set(key, resolvers);
    });
  }

  async signal(key: string): Promise<void> {
    const resolvers = this.resolvers.get(key);
    if (!resolvers) return;

    while (resolvers.length > 0) {
      const resolve = resolvers.pop();
      const value = ListMemoryStorage.lpop(key, 1)[0];
      if (!value || !resolve) break;
      resolve(value);
    }
  }
}
