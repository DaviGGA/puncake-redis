import { describe, test, expect, beforeEach } from "bun:test";
import { QuickList } from "./quick-list";

describe("Quicklist - Size 3", () => {

    let quickList: QuickList<string>;

    beforeEach(() => {
        quickList = new QuickList<string>(3);
    })

    describe("leftAdd" , () => {

        test("left adding into a empty quicklist", () => {
            quickList.leftAdd("b");
            quickList.leftAdd("a");

            expect(quickList.head?.value).toEqual(["a", "b"]);
            expect(quickList.length).toBe(2);
        })

        test("left adding into a head full quicklist", () => {
            quickList.leftAdd("d");
            quickList.leftAdd("c");
            quickList.leftAdd("b");
            quickList.leftAdd("a");

            expect(quickList.head?.value).toEqual(["a"]);
            expect(quickList.head?.value.length).toBe(1);
            
            expect(quickList.head?.next?.value).toEqual(["b", "c", "d"]);
            expect(quickList.head?.next?.value.length).toBe(3);

            expect(quickList.length).toBe(4);
        })
    })

    describe("rightAdd", () => {
        test("right adding into a empty quicklist", () => {
            quickList.rightAdd("a");
            quickList.rightAdd("b");

            expect(quickList.head?.value).toEqual(["a", "b"]);
            expect(quickList.length).toBe(2);
        })
        
        test("right adding into a tail full quicklist", () => {
            quickList.rightAdd("a");
            quickList.rightAdd("b");
            quickList.rightAdd("c");
            quickList.rightAdd("d");

            expect(quickList.tail?.value).toEqual(["d"]);
            expect(quickList.tail?.value.length).toBe(1);
            
            expect(quickList.tail?.previous?.value).toEqual(["a","b","c"]);
            expect(quickList.tail?.previous?.value.length).toBe(3);

            expect(quickList.length).toBe(4);
        })
    })

    describe("shift", () => {
        test("deleting without empty the node", () => {
            quickList.rightAdd("a");
            quickList.rightAdd("b");
            quickList.rightAdd("c");

            quickList.shift();
            const value = quickList.shift();

            expect(value).toBe("b");
            expect(quickList.head?.value).toEqual(["c"]);
            expect(quickList.length).toBe(1);
        })

        test("deleting to empty the node", () => {
            quickList.rightAdd("a");
            quickList.rightAdd("b");
            quickList.rightAdd("c");
            quickList.rightAdd("d");
            quickList.rightAdd("e");

            quickList.shift();
            quickList.shift();
            quickList.shift();

            expect(quickList.head?.value).toEqual(["d", "e"]);
            expect(quickList.length).toBe(2);
        })
    })

    describe("toArray", () => {
        test("Giving an quicklist should return it as array", () => {
            quickList.rightAdd("a");
            quickList.rightAdd("b");
            quickList.rightAdd("c");
            quickList.rightAdd("d");
            quickList.rightAdd("e");

            expect(quickList.toArray()).toEqual(["a", "b", "c", "d", "e"]);
        })
    })

    describe("slice", () => {
        test("Giving an quicklist should return a array slice", () => {
            quickList.rightAdd("a");
            quickList.rightAdd("b");
            quickList.rightAdd("c");
            quickList.rightAdd("d");
            quickList.rightAdd("e");

            expect(quickList.slice(2,5)).toEqual(["c", "d", "e"]);
        })
    })
})