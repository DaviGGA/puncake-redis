import ListMemoryStorage from "../access";
import { array } from "@common/Resp/data-types";

type Lrange = {
  key: string,
  start: string,
  end: string
}

export function lrange({ key, start, end }: Lrange) {
  return array(
    ListMemoryStorage.lrange(
      key, 
      parseInt(start), 
      parseInt(end)
    )
  );
}
