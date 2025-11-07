import { integer } from "@common/Resp/data-types";
import ListMemoryStorage from "../access";

type Llen = { key: string }

export function llen({ key }: Llen) {
  return integer(ListMemoryStorage.llen(key));
}
