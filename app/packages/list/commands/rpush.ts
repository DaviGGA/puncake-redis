import { integer } from "@common/Resp/data-types";
import ListMemoryStorage from "../access";

type Rpush = {
  key: string,
  value: string[],
}

export function rpush({ key, value }: Rpush) {
  return integer(ListMemoryStorage.rpush(key, value));
}
