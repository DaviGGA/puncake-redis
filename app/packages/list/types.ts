import type { StringValue } from "@base/types";
import type { QuickList } from "@data-structures/quick-list";

export type ListValue = { list: QuickList<StringValue>; type: "list" };