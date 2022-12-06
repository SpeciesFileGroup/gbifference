import { IConfiguration, ISource, IOccurrences, ITable } from "./interfaces"
import { TOccurrence, TRemark } from './types'
import { OCCURRENCE_ATTRIBUTES } from "./constants/occurrenceAttributes"
import { makeGetRequest, EventEmitter, createOccurrenceTable } from './utils'
import { getRemark } from "@/utils/remark"
import GBIFService from '@/services/gbif'

export default class GBifference extends EventEmitter {
  occurrence: IOccurrences = {}
  remark: TRemark = {}
  element: HTMLElement | undefined

  constructor (opt: IConfiguration) {
    super()
    const { occurrenceId, source, element } = opt

    if (!occurrenceId) {
      throw('No occurrenceId')
    }

    if (!occurrenceId || (!source.dwcObject && !source.url)) {
      throw('No source provided')
    }

    this.element = typeof element === 'string'
      ? document.querySelector(element) as HTMLElement
      : element

    this.init(opt)
  }

  private async init ({ datasetKey, occurrenceId, source }: IConfiguration) {
    const occurrence: IOccurrences = {}
    const sourceOccurrence: TOccurrence = await this.getOccurrenceFromSource(source)
    const GBIFOccurrence = await this.getGBIFOccurrence({
      datasetKey,
      occurrenceId: occurrenceId || sourceOccurrence.occurrenceId
    })

    this.emit('start', this.occurrenceObjectTable)

    if (GBIFOccurrence) {
      occurrence.original = await GBIFService.getOccurrenceFragment(GBIFOccurrence.key)
      occurrence.interpreted = GBIFOccurrence
    }

    this.occurrence = occurrence

    if (
      occurrence.original && 
      occurrence.interpreted
    ) {
      this.remark = getRemark(occurrence.original, occurrence.interpreted)
    }

    if (this.element) {
      createOccurrenceTable(this.element, this.occurrenceObjectTable)
    }

    this.emit('complete', this.occurrenceObjectTable)
  }

  private async getGBIFOccurrence ({ datasetKey, occurrenceId }: { datasetKey?: string, occurrenceId: string }) {
    if (datasetKey) {
      return GBIFService.getOccurrenceByDataset({ datasetKey, occurrenceId })
    }

    return (await GBIFService.searchOccurrence({ occurrenceId })).results[0]
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
    const occurrenceTypes = Object.keys(this.occurrence)
    const table: ITable = {
      dwcAttributes: {},
      headers: [...occurrenceTypes, 'remark']
    }

    OCCURRENCE_ATTRIBUTES.forEach((attr: string) => {
      const attrObject = Object.fromEntries(occurrenceTypes.map(key => [key, this.occurrence[key][attr] || '']))

      table.dwcAttributes[attr] = {
        ...attrObject,
        remark: this.remark[attr]
      }
    })

    return table
  }
}
