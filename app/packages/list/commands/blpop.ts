import { eventEmitter } from "app/packages/persistence/events";
import ListMemoryStorage, { asyncQueue } from "../access";
import { array, nullArray } from "@common/Resp/data-types";

type Blpop = {
  key: string;
  timeout: string;
};

type Seconds = number;
const toMiliseconds = (s: Seconds) => s * 1000;

export const blpopListeners: Map<number, any> = new Map();

export async function blpop({ key, timeout }: Blpop): Promise<string> {
  const result = ListMemoryStorage.lpop(key, 1);

  if (result.length > 0) {
    return getResult(key, result);
  }

  const asyncResult = await asyncQueue.wait(key);

  return getResult(key, [asyncResult]);
}

function getResult(key: string, result: string[]) {
  return array([key, result[0]]);
}
