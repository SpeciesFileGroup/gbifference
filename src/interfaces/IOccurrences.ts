import { TOccurrence, TRemark } from "@/types"

export interface IOccurrences {
  original: TOccurrence
  interpreted: TOccurrence
  source: TOccurrence
}


export interface IGbifOccurrence extends TOccurrence {
  key: number
  datasetKey: string
}
