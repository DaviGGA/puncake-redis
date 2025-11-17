import { integer } from "@common/Resp/data-types";
import ListMemoryStorage from "../access";

type Rpush = {
  key: string,
  value: string[],
}

export  async function rpush({ key, value }: Rpush) {
  return integer(await ListMemoryStorage.rpush(key, value));
}
