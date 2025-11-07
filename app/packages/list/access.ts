import { db } from "@common/storage";
import { eventEmitter } from "../persistence/events";
import type { ListValue } from "@common/types";
import type { StringValue } from "@base/types";

function rpush(key: string, values: string[]) {
  const result = db.get(key) as ListValue | undefined;

  if (!result) {
    db.set(key, {
      length: values.length,
      list: values.map(createStringValue),
      type: "list",
    });

    const valuesLength = values.length;

    eventEmitter.emit("ELEMENT_ADDED", key);

    return valuesLength;
  }

  values.forEach((value) => {
    result.length++;
    result.list.push(createStringValue(value));
  });

  db.set(key, result);

  eventEmitter.emit("ELEMENT_ADDED", key);

  const resultLength = result.length;

  return resultLength;
}

function lpush(key: string, values: string[]) {
  const result = db.get(key) as ListValue | undefined;

  if (!result) {
    db.set(key, {
      length: values.length,
      list: values.reverse().map(createStringValue),
      type: "list",
    });

    const valuesLength = values.length;

    eventEmitter.emit("ELEMENT_ADDED", key);

    return valuesLength;
  }

  values.forEach((value) => {
    result.length++;
    result.list.unshift(createStringValue(value));
  });

  db.set(key, result);

  const resultLength = result.length;

  eventEmitter.emit("ELEMENT_ADDED", key);

  return resultLength;
}

function lrange(key: string, start: number, end: number) {
  const result = db.get(key) as ListValue | undefined;

  if (!result || start >= result.length || (start > end && end >= 0)) return [];

  const startIndex = getStartIndex(start, result.length);
  const endIndex = getEndIndex(end, result.length);

  return result.list.slice(startIndex, endIndex).map((v) => v.value);
}

function getStartIndex(start: number, resultLength: number) {
  if (resultLength < Math.abs(start)) return 0;
  return start >= 0 ? start : resultLength + start;
}

function getEndIndex(end: number, resultLength: number) {
  return end >= 0 ? end + 1 : resultLength + end + 1;
}

function llen(key: string) {
  const result = db.get(key) as ListValue | undefined;
  return result?.length ?? 0;
}

function lpop(key: string, quantity: number) {
  const result = db.get(key) as ListValue | undefined;

  if (!result || result.length == 0) return [];

  if (quantity >= result.length) {
    const shiftedValues = result.list.slice();
    result.length = 0;
    result.list = [];
    return shiftedValues.map((v) => v.value);
  }

  const shiftedValues: StringValue[] = [];

  for (let i = 0; i < quantity; i++) {
    const shiftedValue = result.list.shift();
    shiftedValues.push(shiftedValue!);
    result.length--;
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
