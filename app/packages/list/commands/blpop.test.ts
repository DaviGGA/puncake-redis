import { array, integer } from "@common/Resp/data-types";
import { describe, test, expect, beforeEach } from "bun:test";
import List from "@list";
import { db } from "@common/storage";
import { sleep } from "@common/utils";

// beforeEach(() => {
//   db.clear();
// });

List.blpop({key: "foo", timeout: "5000", socketId: 1})
List.lpush({key: "foo", value: ["1"]})

// describe("BLPOP", () => {
//   describe("COMMANDS", () => {
//     test("When blocking, should return the value when something is pushed", async () => {
//         const blockPromise = List.blpop({key: "foo", timeout: "5000", socketId: 1})
//         List.lpush({key: "foo", value: ["1"]})
//         expect((await blockPromise)).toBe("1");
//     });

//     test("When blocking two times, should return the value in order", async () => {
//         List.blpop({key: "foo", timeout: "0", socketId: 1})
//             .then(res => expect(res).toBe("waa"))
        
//         await sleep(100);

//         List.lpush({key: "foo", value: ["1"]})
//     });
//   });
// });
