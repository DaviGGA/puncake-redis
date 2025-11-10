export class QuickListNode<T> {
    public next: QuickListNode<T> | null;
    public previous: QuickListNode<T> | null;
    public value: T[];

    constructor() {
        this.next = null;
        this.previous = null;
        this.value = [];
    }
}

const DEFAULT_SIZE = 64;

export class QuickList<T> {
    private _head: QuickListNode<T> | null;
    private _tail: QuickListNode<T> | null;
    private _length: number;
    private size: number;

    constructor(size: number = DEFAULT_SIZE) {
        this._head = null;
        this._tail = null;
        this._length = 0;
        this.size = size;
    }

    static fromArray<T>(arr: T[], size: number = DEFAULT_SIZE): QuickList<T> {
        const quickList = new this<T>(size);
        arr.forEach(item => quickList.rightAdd(item));
        return quickList;
    }

    leftAdd(value: T) {
        if(!this._head) {
            this._head = new QuickListNode<T>();
            this._head.value = [value];
            this._tail = this._head;
            this._length++;
            return
        }

        const isHeadArrayFull = this._head.value.length == this.size;
        if (isHeadArrayFull) {
            const newNode = new QuickListNode<T>();
            newNode.value = [value];
            newNode.next = this._head;
            
            this._head.previous = newNode;
            this._head = newNode;
            this._length++;
            
            return;
        }

        this._head.value.unshift(value);
        this._length++;
    }

    rightAdd(value: T) {
        if(!this._tail) {
            this._tail = new QuickListNode<T>();
            this._tail.value = [value];
            this._head = this._tail;
            this._length++;
            return        
        }

        const isTailArrayFull = this._tail.value.length === this.size;
        if(isTailArrayFull) {
            const newNode = new QuickListNode<T>();
            newNode.value = [value];

            this._tail.next = newNode;
            newNode.previous = this._tail;
            this._tail = newNode;

            this._length++;

            return
        }

        this._tail.value.push(value);
        this._length++;
    }

    shift(): T | undefined {
        if(!this._head) return undefined;
        if(this._length === 0) return undefined;

        const value = this._head.value.shift();

        if (this._head.value.length === 0) {
            this._head.next!.previous = null;
            this._head = this._head.next;
        }

        this._length--;
        return value;
    }

    toArray(): T[] {
        let node = this._head;

        let result: T[] = [];
        while(node) {
            result = result.concat(node.value);
            node = node.next;
        }

        return result;
    }

    slice(start: number, end: number): T[] {
        // TO-DO: This is kinda lame, refactor it later
        if (start >= this._length) return [];
        if (start > end && end >= 0) return [];

        return this.toArray()
            .slice(this.getStartIndex(start), this.getEndIndex(end));
    }

    private getStartIndex(start: number) {
        if (this._length < Math.abs(start)) return 0;
        return start >= 0 ? start : this._length + start;
    }

    private getEndIndex(end: number) {
    return end >= 0 ? end + 1 : this._length + end + 1;
    }

    get head() { return this._head }
    get length() { return this._length }
    get tail() { return this._tail }

}