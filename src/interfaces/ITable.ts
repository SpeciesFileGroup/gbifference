import { TOccurrence } from "@/types"

export interface ITable {
  dwcRecords: { [key: string]: ITableRow },
  remarks: { [ key: string]: string },
  headers: Array<string>,
  inSync: boolean
}

export interface ITableRow {
  original?: string | number | null
  interpreted?: string | number | null
  source?: string | number | null
  remark?: string
}
