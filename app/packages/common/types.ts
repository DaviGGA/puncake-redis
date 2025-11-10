import type { StringValue } from "@base/types"
import type { ListValue } from "@list/types"

export type id = string
export type Entries = string[]
export type Stream = [id, string[]]
export type StreamValue = {entries: Stream[]} &
  {type: "stream"}

export type Values = StringValue | ListValue | StreamValue