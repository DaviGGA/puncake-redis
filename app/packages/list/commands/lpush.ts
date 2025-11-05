import { integer } from "@common/Resp/data-types";
import ListMemoryStorage from "../access";


type Rpush = {
  key: string,
  value: string[],
}

export function lpush({ key, value }: Rpush) {
  return integer(ListMemoryStorage.lpush(key, value));
}