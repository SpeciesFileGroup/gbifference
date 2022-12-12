import { IGbifOccurrence, IGbifSearchOccurrence } from '@/interfaces'
import { makeGetRequest } from './../utils/makeRequest'
import { buildGetUrl } from '@/utils/index'

const API_URL = 'https://api.gbif.org/v1'

export default {
  searchOccurrence (params: { [key: string]: string }): Promise<IGbifSearchOccurrence> {
    return makeGetRequest(buildGetUrl(`${API_URL}/occurrence/search`, params))
  },

  getOccurrence (gbifId: number): Promise<IGbifOccurrence> {
    return makeGetRequest(`${API_URL}/occurrence/${gbifId}`)
  },

  getOccurrenceFragment(gbifID: number): Promise<IGbifOccurrence> {
    return makeGetRequest(`${API_URL}/occurrence/${gbifID}/fragment`)
  },

  getOccurrenceVerbatim(gbifID: number): Promise<IGbifOccurrence> {
    return makeGetRequest(`${API_URL}/occurrence/${gbifID}/verbatim`)
  },

  getOccurrenceByDataset ({ datasetKey, occurrenceId }: { datasetKey: string, occurrenceId: string }): Promise<IGbifOccurrence> {
    return makeGetRequest(`${API_URL}/occurrence/${datasetKey}/${occurrenceId}`)
  }
}

