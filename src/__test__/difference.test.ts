import { getRemark } from '@/utils/remark'
import { DIFFERENCE_TYPES } from '@/constants/differenceTypes'

const MOCK_DIFFERENCE = {
  decimalLatitude: DIFFERENCE_TYPES.Inferred,
  basisOfRecord: DIFFERENCE_TYPES.Altered,
  decimalLongitude: DIFFERENCE_TYPES.Excluded
}

const MOCK_SOURCE_DATA = {
  basisOfRecord: "PreservedSpecimen",
  decimalLongitude: 15.35405,
  decimalLatitude: null,
}

const MOCK_GBIF_DATA = {
  basisOfRecord: "PRESERVED_SPECIMEN",
  decimalLongitude: null,
  decimalLatitude: 67.02865,
}

describe('gbif', () => {
  it('has difference', () => {
    const remark = getRemark(MOCK_SOURCE_DATA, MOCK_GBIF_DATA)

    expect(remark).toEqual(MOCK_DIFFERENCE)
  })

  it('has difference on empty and null', () => {
    const original = { foo: null }
    const interpreted = { foo: '' }
    const remark = getRemark(original, interpreted)

    expect(remark).toEqual({})
  })
})