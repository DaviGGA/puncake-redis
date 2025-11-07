import { array, integer } from "@common/Resp/data-types";
import { describe, test, expect, beforeEach } from "bun:test";
import List from "@list";
import { db } from "@common/storage";
import { Resp } from "@common/Resp";

beforeEach(() => {
  db.clear();
});

describe("LRANGE", () => {
  describe("COMMANDS", () => {
    test('Given RPUSH foo a b c d e, when LRANGE 2 4, should return ["c", "d", "e"]', () => {
      List.rpush({ key: "foo", value: ["a", "b", "c", "d", "e"] });
      expect(List.lrange({ key: "foo", start: "2", end: "4" })).toBe(
        array(["c", "d", "e"])
      );
    });

    test("Given LRANGE foo 5 7, when start index >= list length, return []", () => {
      List.rpush({ key: "foo", value: ["a", "b"] });
      expect(List.lrange({ key: "foo", start: "5", end: "7" })).toBe(array([]));
    });

    test('Given RPUSH foo a b c d e, when LRANGE foo -2 -1, should return ["d", "e"]', () => {
      List.rpush({ key: "foo", value: ["a", "b", "c", "d", "e"] });
      expect(List.lrange({ key: "foo", start: "-2", end: "-1" })).toBe(
        array(["d", "e"])
      );
    });

    test('Given RPUSH foo a b c d e, when LRANGE foo 0 -3, should return ["a", "b", "c"]', () => {
      List.rpush({ key: "foo", value: ["a", "b", "c", "d", "e"] });
      expect(List.lrange({ key: "foo", start: "0", end: "-3" })).toBe(
        array(["a", "b", "c"])
      );
    });

    test('Given RPUSH foo a b c d e, when LRANGE foo -3 -2, should return ["c", "d"]', () => {
      List.rpush({ key: "foo", value: ["a", "b", "c", "d", "e"] });
      expect(List.lrange({ key: "foo", start: "-3", end: "-2" })).toBe(
        array(["c", "d"])
      );
    });
  });

  describe("RESP", () => {
    test('LRANGE foo 0 2 should return ["LRANGE", "foo", "0", "2"]', () => {
      expect(
        Resp("*4\r\n$6\r\nLRANGE\r\n$3\r\nfoo\r\n$1\r\n0\r\n$1\r\n2\r\n")[0]
      ).toEqual(["LRANGE", "foo", "0", "2"]);
    });
  });
});
