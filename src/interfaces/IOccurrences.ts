import { TOccurrence } from "@/types"

export interface IOccurrence {
  [key: string]: TOccurrence
}

export interface IOccurrences {
  original: IOccurrence
  interpreted: IOccurrence
  source: IOccurrence
}

export interface IGbifOccurrence extends IOccurrence {
  key: number
  datasetKey: string
}

export interface IGbifSearchOccurrence {
  key: number
  datasetKey: string
  results: IGbifOccurrence[]
  [key: string]: TOccurrence | IGbifOccurrence[]
}
