type Resolver<T> = (value: T) => void;

export class AsyncSignalQueue<T> {

    private values: T[]
    private resolvers: Resolver<T>[]

    constructor() {
        this.values = [];
        this.resolvers = [];
    }

    wait(): Promise<T> {
        return new Promise((resolve) => {
            if (this.values.length > 0) {
                const value = this.values.pop();
                return resolve(value as T);
            }

            this.resolvers.unshift(resolve);
        })
    }

    release(value: T): void {
        if(this.resolvers.length > 0) {
            const resolve = this.resolvers.pop() as Resolver<T>;
            resolve(value);
            return;
        }

        this.values.unshift(value);
    }
}