import { makeGetRequest } from './../utils/makeRequest'
import { buildGetUrl } from '@/utils/index'

const API_URL = 'https://api.gbif.org/v1'

export default {
  searchOccurrence (params: { [key: string]: string }): Promise<any> {
    return makeGetRequest(buildGetUrl(`${API_URL}/occurrence/search`, params))
  },

  getOccurrence (gbifId: number): Promise<any> {
    return makeGetRequest(`${API_URL}/occurrence/${gbifId}`)
  },

  getOccurrenceFragment(gbifID: number): Promise<any> {
    return makeGetRequest(`${API_URL}/occurrence/${gbifID}/fragment`)
  },

  getOccurrenceVerbatim(gbifID: number): Promise<any> {
    return makeGetRequest(`${API_URL}/occurrence/${gbifID}/verbatim`)
  },

  getOccurrenceByDataset ({ datasetKey, occurrenceId }): Promise<any> {
    return makeGetRequest(`${API_URL}/occurrence/${datasetKey}/${occurrenceId}`)
  }
}

