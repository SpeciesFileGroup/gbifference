import { 
  IConfiguration,
  ISource,
  IOccurrence,
  IOccurrences,
  IGbifferenceData,
  IGbifOccurrence,
  IDwcRecords,
  IRemark
} from "./interfaces"
import { makeGetRequest } from '@/utils'
import { getRemark } from "@/utils/remark"
import GBIFService from '@/services/gbif'

async function getGBIFOccurrence ({ datasetKey, occurrenceId }: { datasetKey?: string, occurrenceId: string }): Promise<IGbifOccurrence> {
  if (datasetKey) {
    return GBIFService.getOccurrenceByDataset({ datasetKey, occurrenceId })
  }

  return (await GBIFService.searchOccurrence({ occurrenceId })).results[0]
}

function getOccurrenceFromSource (source: ISource) {
  const { url, dwcObject, ...parameters } = source

  if (dwcObject) { return dwcObject }
  if (!url) { throw('No URL Source') }

  return makeGetRequest(url, parameters)
}

function getDwcTermsFromOccurrences(dwcObjs: IOccurrence[]): string[] {
  let terms: string[] = []

  dwcObjs.forEach((obj: IOccurrence) => {
    terms = [
      ...terms,
      ...Object.keys(obj)
    ]
  })

  terms = terms.filter(
    term => dwcObjs.some(occurrence => occurrence[term])
  )

  terms.sort()

  return [...new Set(terms)]
}

export default function (opt: IConfiguration) {
  const occurrences: IOccurrences = {
    source: {},
    original: {},
    interpreted: {}
  }

  if (!opt.occurrenceId && (!opt.source.dwcObject && !opt.source.url)) {
    throw('No source provided')
  }

  async function init ({ datasetKey, occurrenceId, source }: IConfiguration): Promise<IGbifferenceData> {
    const sourceOccurrence: IOccurrence = await getOccurrenceFromSource(source)

    if (!opt.occurrenceId && !sourceOccurrence.occurrenceID) {
      throw('No occurrenceId')
    }

    const gbifOccurrence: IGbifOccurrence = await getGBIFOccurrence({
      datasetKey,
      occurrenceId: occurrenceId || sourceOccurrence.occurrenceID as string
    })

    if (gbifOccurrence) {
      occurrences.original = await GBIFService.getOccurrenceFragment(gbifOccurrence.key)
      occurrences.interpreted = gbifOccurrence
    }

    occurrences.source = sourceOccurrence

    return makeOccurrenceTableObject()
  }

  function makeOccurrenceTableObject (): IGbifferenceData {
    const dwcRecords: IDwcRecords = {}
    const dwcTerms: string[] = getDwcTermsFromOccurrences([occurrences.source, occurrences.original])
    const inSync: boolean = dwcTerms.every((term: string) => occurrences.source[term] == occurrences.original[term])
    const remarks: IRemark = getRemark(occurrences.original, occurrences.interpreted, dwcTerms)

    for (const key in occurrences) {
      const record: IOccurrence = occurrences[key as keyof IOccurrences]

      if (Object.keys(record).length) {
        dwcRecords[key] = record
      }
    }

    return {
      dwcRecords,
      dwcTerms,
      inSync,
      remarks
    }
  }

  return init(opt)
}
