import { TOccurrence } from "@/types"

export interface ITable {
  dwcRecords: { [key: string]: TOccurrence },
  dwcTerms: Array<string>
  remarks: { [ key: string]: string },
  inSync: boolean
}

export interface ITableRow {
  original?: string | number | null
  interpreted?: string | number | null
  source?: string | number | null
  remark?: string
}
