import { TRemark } from './types/TRemark';
import { 
  IConfiguration,
  ISource,
  IOccurrences,
  ITable,
  IGbifOccurrence
} from "./interfaces"
import { TOccurrence } from '@/types'
import { makeGetRequest } from '@/utils'
import { getRemark } from "@/utils/remark"
import GBIFService from '@/services/gbif'

async function getGBIFOccurrence ({ datasetKey, occurrenceId }: { datasetKey?: string, occurrenceId: string }) {
  if (datasetKey) {
    return GBIFService.getOccurrenceByDataset({ datasetKey, occurrenceId })
  }

  return (await GBIFService.searchOccurrence({ occurrenceId }))?.results[0]
}

function getOccurrenceFromSource (source: ISource) {
  const { url, dwcObject, ...parameters } = source

  if (dwcObject) { return dwcObject }
  if (!url) { throw('No URL Source') }

  return makeGetRequest(url, parameters)
}

function getDwcTerms(dwcObjs: Array<TOccurrence>): Array<string> {
  const keys: Array<string> = []

  dwcObjs.forEach((obj: TOccurrence) => {
    keys.concat(Object.keys(obj))
  })

  return [...new Set(keys)]
}

export default function (opt: IConfiguration) {
  const occurrence: IOccurrences = {
    source: {},
    original: {},
    interpreted: {}
  }

  if (!opt.occurrenceId || (!opt.source.dwcObject && !opt.source.url)) {
    throw('No source provided')
  }

  async function init ({ datasetKey, occurrenceId, source }: IConfiguration): Promise<ITable> {
    const sourceOccurrence: TOccurrence = await getOccurrenceFromSource(source)

    if (!opt.occurrenceId && !sourceOccurrence.occurrenceId) {
      throw('No occurrenceId')
    }

    const gbifOccurrence: IGbifOccurrence = await getGBIFOccurrence({
      datasetKey,
      occurrenceId: occurrenceId || sourceOccurrence.occurrenceId as string
    })

    if (gbifOccurrence) {
      occurrence.original = await GBIFService.getOccurrenceFragment(gbifOccurrence.key)
      occurrence.interpreted = gbifOccurrence
    }

    occurrence.source = sourceOccurrence

    return makeOccurrenceTableObject()
  }

  function makeOccurrenceTableObject (): ITable {
    const dwcRecords: { [dwcRecord: string]: TOccurrence } = {}
    const dwcTerms: Array<string> = getDwcTerms([occurrence.source, occurrence.original])
    const inSync: boolean = dwcTerms.every((term: string) => occurrence.source[term] == occurrence.original[term])
    const remarks: TRemark = getRemark(occurrence.original, occurrence.interpreted)

    for (const key in occurrence) {
      const record = occurrence[key as keyof IOccurrences]

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
