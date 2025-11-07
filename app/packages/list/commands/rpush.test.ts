import { array, integer } from "@common/Resp/data-types";
import { describe, test, expect, beforeEach } from "bun:test";
import List from "@list";
import { db } from "@common/storage";

beforeEach(() => {
  db.clear();
});

describe("RPUSH", () => {
  describe("COMMANDS", () => {
    test("Given RPUSH foo a b should return 2", () => {
      expect(List.rpush({ key: "foo", value: ["a", "b"] })).toBe(integer(2));
    });

    test("Given RPUSH foo a b, and then RPUSH foo c should return 3", () => {
      List.rpush({ key: "foo", value: ["a", "b"] });
      expect(List.rpush({ key: "foo", value: ["c"] })).toBe(integer(3));
    });
  });

  test('Given RPUSH foo a b c d e, when LRANGE 2 4, should return ["c", "d", "e"]', () => {
    List.rpush({ key: "foo", value: ["a", "b", "c", "d", "e"] });
    expect(List.lrange({ key: "foo", start: "2", end: "4" })).toBe(
      array(["c", "d", "e"])
    );
  });
});
