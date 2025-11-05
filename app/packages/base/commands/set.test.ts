import Base from "@base";
import { Resp } from "@common/Resp";
import { bulkString, simpleString } from "@common/Resp/data-types";
import { db } from "@common/storage";
import { describe, test, expect, beforeEach } from "bun:test";

beforeEach(() => {
  db.clear();
});

describe("SET", () => {
  describe("COMMAND", () => {
    test("Given a SET foo bar, when GET foo should return bar", () => {
      expect(
        Base.set({ key: "foo", value: "bar", px: undefined, expiryTime: "0" })
      ).toBe(simpleString("OK"));
      expect(Base.get({ key: "foo" })).toBe(bulkString("bar"));
    });

    test("Given a SET foo px 5, when getting foo after 10ms should return nil", async () => {
      expect(
        Base.set({ key: "foo", value: "bar", px: "5", expiryTime: "5" })
      ).toBe(simpleString("OK"));

      await new Promise((r) => setTimeout(r, 10));

      expect(Base.get({ key: "foo" })).toBe(bulkString(""));
    });
  });

  describe("RESP", () => {
    test('SET foo bar should return ["SET", "foo", "bar"]', () => {
      expect(Resp("*3\r\n$3\r\nSET\r\n$3\r\nfoo\r\n$3\r\nbar\r\n")[0]).toEqual([
        "SET",
        "foo",
        "bar",
      ]);
    });

    test('SET foo bar PX 100 should return ["SET", "foo", "bar", "PX", "100"]', () => {
      expect(
        Resp(
          "*5\r\n$3\r\nSET\r\n$3\r\nfoo\r\n$3\r\nbar\r\n$2\r\nPX\r\n$3\r\n100\r\n"
        )[0]
      ).toEqual(["SET", "foo", "bar", "PX", "100"]);
    });
  });
});
