import { describe, test, expect, beforeEach } from "bun:test";
import { AsyncSignalQueue } from "./async-signal-queue";

describe("AsyncSignalQueue", () => {

    test("foo", () => {
       const asyncQueue = new AsyncSignalQueue<string>();
       
        asyncQueue.wait()
            .then(res => expect(res).toBe("foo"))

        asyncQueue.release("foo");
    })
})