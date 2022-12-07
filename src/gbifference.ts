import { IConfiguration, ISource, IOccurrences, ITable, ITableRow, IGbifOccurrence } from "./interfaces"
import { TOccurrence, TRemark } from '@/types'
import { DWC_TERMS } from "@/constants"
import { makeGetRequest, EventEmitter } from '@/utils'
import { createGbifferenceTable } from '@/ui/vanilla/createGbifferenceTable'
import { getRemark } from "@/utils/remark"
import GBIFService from '@/services/gbif'

export default class GBifference extends EventEmitter {
  remarks: TRemark = {}
  element: HTMLElement | undefined
  occurrence: IOccurrences = {
    source: {},
    original: {},
    interpreted: {}
  }

  constructor (opt: IConfiguration) {
    super()
    const { occurrenceId, source, element } = opt

    if (!occurrenceId || (!source.dwcObject && !source.url)) {
      throw('No source provided')
    }

    this.element = typeof element === 'string'
      ? document.querySelector(element) as HTMLElement
      : element

    this.init(opt)
  }

  private async init ({ datasetKey, occurrenceId, source }: IConfiguration) {
    const sourceOccurrence: TOccurrence = await this.getOccurrenceFromSource(source)

    if (!occurrenceId && !sourceOccurrence.occurrenceId) {
      throw('No occurrenceId')
    }

    const gbifOccurrence: IGbifOccurrence = await this.getGBIFOccurrence({
      datasetKey,
      occurrenceId: occurrenceId || sourceOccurrence.occurrenceId as string
    })

    if (gbifOccurrence) {
      this.occurrence.original = await GBIFService.getOccurrenceFragment(gbifOccurrence.key)
      this.occurrence.interpreted = gbifOccurrence
    }

    this.occurrence.source = sourceOccurrence

    if (this.element) {
      createGbifferenceTable(this)
    }

    this.emit('complete', this.occurrenceObjectTable)
  }

  private async getGBIFOccurrence ({ datasetKey, occurrenceId }: { datasetKey?: string, occurrenceId: string }) {
    if (datasetKey) {
      return GBIFService.getOccurrenceByDataset({ datasetKey, occurrenceId })
    }

    return (await GBIFService.searchOccurrence({ occurrenceId }))?.results[0]
  }

  private getOccurrenceFromSource (source: ISource) {
    const { url, dwcObject, ...parameters } = source

    if (dwcObject) {
      return dwcObject
    }
  
    if (!url) {
      throw('No URL Source')
    }
  
    return makeGetRequest(url, parameters)
  }

  get occurrenceObjectTable (): ITable {
    const occurrenceTypes: Array<string> = Object.keys(this.occurrence).filter((key: string) => !!Object.keys(this.occurrence[key as keyof IOccurrences]).length)
    const table: ITable = {
      dwcRecords: {},
      headers: [...occurrenceTypes],
      inSync: DWC_TERMS.every((term: string) => this.occurrence.source[term] == this.occurrence.original[term]),
      remarks: getRemark(this.occurrence.original, this.occurrence.interpreted)
    }

    DWC_TERMS.forEach((term: string) => {
      const attrObject: ITableRow = Object.fromEntries(occurrenceTypes.map((key: string) => [key, this.occurrence[key as keyof IOccurrences][term] || '']))

      table.dwcRecords[term] = attrObject
    })

    return table
  }
}
