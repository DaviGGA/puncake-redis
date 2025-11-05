import Base from "@base";
import { Resp } from "@common/Resp";
import { bulkString } from "@common/Resp/data-types";
import { db } from "@common/storage";
import { describe, test, expect, beforeEach } from "bun:test";

beforeEach(() => {
  db.clear();
});

describe("GET", () => {
  describe("COMMAND", () => {
    test("Given a GET foo, when foo does not exist should return nil", () => {
      expect(Base.get({ key: "foo" })).toBe(bulkString(""));
    });
  });

  describe("RESP", () => {
    test('GET foo should return ["GET", "foo"]', () => {
      expect(Resp("*2\r\n$3\r\nGET\r\n$3\r\nfoo\r\n")[0]).toEqual([
        "GET",
        "foo",
      ]);
    });
  });
});

