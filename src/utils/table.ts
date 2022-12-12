import { IGbifferenceData, ITable } from "@/interfaces"
import { TTableRow } from "@/types"
import { OccurrenceRecord } from '@/constants'

function getHeaders (data: IGbifferenceData): string[] {
  if (data.inSync) {
    return ['Term', 'Source / original', 'Interpreted', 'Remark']
  } else {
    return ['Term', ...Object.keys(data.dwcRecords), 'Remark']
  }
}

function getOccurrenceRowValues (data: IGbifferenceData, term: string): TTableRow[] {
  const values = (data.inSync) 
    ? Object.entries(data.dwcRecords)
      .filter(([occurrenceType, _]) => occurrenceType !== OccurrenceRecord.Original)
      .map(([_, occurrence]) => occurrence[term])
    : Object.values(data.dwcRecords).map(occurrence => occurrence[term])

  return [
    term, 
    ...values, 
    data.remarks[term]
  ]
}

export function makeTableObj (data: IGbifferenceData): ITable {
  const headers: string[] = getHeaders(data)
  const rows: TTableRow[][] = data.dwcTerms.map(term => getOccurrenceRowValues(data, term))

  return {
    headers,
    rows
  }
}