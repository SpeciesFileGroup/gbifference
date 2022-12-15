import { ITableConfiguration } from './../interfaces/IConfiguration';
import { IGbifferenceData, ITable } from "@/interfaces"
import { TTableRow } from "@/types"
import { OccurrenceRecord } from '@/constants'

enum ColumnTitle {
  original = 'Original (GBIF)',
  interpreted = 'Interpreted (GBIF)',
}

function getHeaders (data: IGbifferenceData, sourceTitle: string | undefined): string[] {
  const { source, ...rest } = data.dwcRecords
  const sourceHeader = sourceTitle || 'Source'
  const columns = data.inSync
    ? ['Term', `${sourceHeader} / ${ColumnTitle.original}`, ColumnTitle.interpreted]
    : ['Term', sourceHeader, ...Object.keys(rest).map((key: string) => ColumnTitle[key as keyof typeof ColumnTitle])]

  if (data.remarks.length) {
    columns.push('Remark')
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
  const headers: string[] = getHeaders(data, opt.headers?.source)
  const rows: TTableRow[][] = data.dwcTerms.map((term: string): TTableRow[] => { 
    const row: TTableRow[] = [term]
    
    getOccurrenceRowValues(data, term).forEach(value => {
      row.push(value)
    })

    if (data.remarks.length) {
      row.push(data.remarks[term])
    }

    return row
  })

  return {
    headers,
    rows
  }
}