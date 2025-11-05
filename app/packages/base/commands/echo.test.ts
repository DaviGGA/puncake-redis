import Base from "@base";
import { Resp } from "@common/Resp";
import { bulkString } from "@common/Resp/data-types";
import { db } from "@common/storage";
import { describe, test, expect, beforeEach } from "bun:test";

beforeEach(() => {
  db.clear();
});

describe("ECHO", () => {
  describe("COMMAND", () => {
    test("Given a ECHO foo, should return foo", () => {
      expect(Base.echo({ value: "foo" })).toBe(bulkString("foo"));
    });
  });

  describe("RESP", () => {
    test('ECHO hello shoul return ["ECHO", "hello"]', () => {
      expect(Resp("*2\r\n$4\r\nECHO\r\n$5\r\nhello\r\n")[0]).toEqual([
        "ECHO",
        "hello",
      ]);
    });
  });
});
