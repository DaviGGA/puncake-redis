import Base from "@base";
import { Resp } from "@common/Resp";
import { simpleString } from "@common/Resp/data-types";
import { db } from "@common/storage";
import { describe, test, expect, beforeEach } from "bun:test";

beforeEach(() => {
  db.clear();
});

describe("PING", () => {
  describe("COMMAND", () => {
    test("Ping PONG", () => {
      const result = Base.ping();
      expect(result).toBe(simpleString("PONG"));
    });
  });

  describe("RESP", () => {
    test('PING should return ["PING"]', () => {
      expect(Resp("*1\r\n$4\r\nPING\r\n")[0]).toEqual(["PING"]);
    });

    test('3 PINGS in the same tcp should return [["PING", "PING"]]', () => {
      expect(
        Resp("*1\r\n$4\r\nPING\r\n*1\r\n$4\r\nPING\r\n*1\r\n$4\r\nPING\r\n")
      ).toEqual([["PING"], ["PING"], ["PING"]]);
    });
  });
});
