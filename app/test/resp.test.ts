import { describe, test, expect } from "bun:test";
import { Resp } from "../packages/common/Resp";

describe("RESP", () => {

  test('LRANGE foo 0 2 should return ["LRANGE", "foo", "0", "2"]', () => {
    expect(
      Resp("*4\r\n$6\r\nLRANGE\r\n$3\r\nfoo\r\n$1\r\n0\r\n$1\r\n2\r\n")[0]
    ).toEqual(["LRANGE", "foo", "0", "2"]);
  });
});
