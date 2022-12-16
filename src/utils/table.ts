import { ITableConfiguration, ITableConfigurationHeaders } from './../interfaces/IConfiguration';
import { IGbifferenceData, ITable } from "@/interfaces"
import { TTableRow } from "@/types"
import { OccurrenceRecord } from '@/constants'

enum ColumnTitle {
  original = 'Original (GBIF)',
  interpreted = 'Interpreted (GBIF)',
}

function getHeaders (
  data: IGbifferenceData, 
  headers: ITableConfigurationHeaders | undefined, 
  hasRemarks: boolean
  ): string[] {
  const { source, ...rest } = data.dwcRecords
  const sourceHeader = headers?.source || 'Source'
  const columns = data.inSync
    ? ['Term', `${sourceHeader} / ${ColumnTitle.original}`, ColumnTitle.interpreted]
    : ['Term', sourceHeader, ...Object.keys(rest).map((key: string) => ColumnTitle[key as keyof typeof ColumnTitle])]

  if (hasRemarks) {
    columns.push('Remarks')
  }

  return columns
}

function getOccurrenceRowValues (data: IGbifferenceData, term: string): TTableRow[] {
  const values = (data.inSync) 
    ? Object.entries(data.dwcRecords)
      .filter(([occurrenceType, _]) => occurrenceType !== OccurrenceRecord.Original)
      .map(([_, occurrence]) => occurrence[term])
    : Object.values(data.dwcRecords).map(occurrence => occurrence[term])

  return values
}

export function makeTableObj (data: IGbifferenceData, opt: ITableConfiguration): ITable {
  const hasRemarks = !!Object.keys(data.remarks).length
  const headers: string[] = getHeaders(data, opt.headers, hasRemarks)
  const rows: TTableRow[][] = data.dwcTerms.map((term: string): TTableRow[] => { 
    const row: TTableRow[] = [term]
    
    getOccurrenceRowValues(data, term).forEach(value => {
      row.push(value)
    })

    if (hasRemarks) {
      row.push(data.remarks[term])
    }

    return row
  })

  return {
    headers,
    rows
  }
}