import { db } from "@common/storage";
import { eventEmitter } from "../persistence/events";
import type { StringValue } from "@base/types";
import type { ListValue } from "@list/types";
import { QuickList } from "@common/data-structures/quick-list";
import { AsyncSignalQueue } from "@common/data-structures/async-signal-queue";

export const asyncQueue = new AsyncSignalQueue();

async function rpush(key: string, values: string[]) {
  const result = db.get(key) as ListValue | undefined;

  if (!result) {
    db.set(key, {
      list: QuickList.fromArray(values.map(createStringValue)),
      type: "list",
    });

    const valuesLength = values.length;
    await asyncQueue.signal(key);
    return valuesLength;
  }

  values.forEach((value) => result.list.rightAdd(createStringValue(value)));

  db.set(key, result);

  const resultLength = result.list.length;
  await asyncQueue.signal(key);
  return resultLength;
}

function lpush(key: string, values: string[]) {
  const result = db.get(key) as ListValue | undefined;

  if (!result) {
    db.set(key, {
      list: QuickList.fromArray(values.reverse().map(createStringValue)),
      type: "list",
    });

    const valuesLength = values.length;

    eventEmitter.emit("ELEMENT_ADDED", key);

    return valuesLength;
  }

  values.forEach((value) => result.list.leftAdd(createStringValue(value)));

  db.set(key, result);

  const resultLength = result.list.length;

  eventEmitter.emit("ELEMENT_ADDED", key);

  return resultLength;
}

function lrange(key: string, start: number, end: number) {
  const result = db.get(key) as ListValue | undefined;
  if (!result) return [];
  return result.list.slice(start, end).map((item) => item.value);
}

function llen(key: string) {
  const result = db.get(key) as ListValue | undefined;
  return result?.list.length ?? 0;
}

function lpop(key: string, quantity: number) {
  const result = db.get(key) as ListValue | undefined;

  if (!result || result.list.length == 0) return [];

  if (quantity >= result.list.length) {
    const values = result.list.toArray();
    result.list = new QuickList<StringValue>();
    return values.map((v) => v.value);
  }

  const shiftedValues: StringValue[] = [];

  for (let i = 0; i < quantity; i++) {
    const shiftedValue = result.list.shift();
    shiftedValues.push(shiftedValue!);
  }

  return shiftedValues.map((v) => v.value);
}

const createStringValue = (
  value: string,
  expiryTime: number = 0
): StringValue => ({
  value,
  expiryTime: expiryTime && Date.now() + expiryTime,
  type: "string",
});

const ListMemoryStorage = {
  rpush,
  lpush,
  lrange,
  llen,
  lpop,
};

export default ListMemoryStorage;
