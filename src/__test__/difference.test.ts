import { getRemark } from '@/gbifference'
import { DIFFERENCE_TYPES } from '@/constants/differenceTypes'

const MOCK_DIFFERENCE = {
  decimalLatitude: DIFFERENCE_TYPES.Inferred,
  basisOfRecord: DIFFERENCE_TYPES.Altered,
  decimalLongitude: DIFFERENCE_TYPES.Excluded
}

const MOCK_SOURCE_DATA = {
  "basisOfRecord": "PreservedSpecimen",
  "decimalLongitude": 15.35405,
  "decimalLatitude": null,
}

const MOCK_GBIF_DATA = {
  "basisOfRecord": "PRESERVED_SPECIMEN",
  "decimalLongitude": null,
  "decimalLatitude": 67.02865,
}

describe('gbif', () => {
  it('has difference', () => {
    const remark = getRemark(MOCK_SOURCE_DATA, MOCK_GBIF_DATA)

    expect(remark).toEqual(MOCK_DIFFERENCE)
  })
})