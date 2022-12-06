import { TOccurrence } from "@/types"

export interface ITable {
  dwcAttributes: {
    original?: TOccurrence
    interpreted?: TOccurrence
    source?: TOccurrence
    remark?: string
  },
  headers: Array<string>
}
