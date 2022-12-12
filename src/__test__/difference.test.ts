import { getRemark } from '@/utils/remark'
import { DifferenceType } from '@/constants'

const MOCK_DIFFERENCE = {
  decimalLatitude: DifferenceType.Inferred,
  basisOfRecord: DifferenceType.Altered,
  decimalLongitude: DifferenceType.Excluded
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

const DWC_TERMS = [
  'basisOfRecord',
  'decimalLongitude',
  'decimalLatitude'
]

describe('gbif', () => {
  it('has difference', () => {
    const remark = getRemark(MOCK_SOURCE_DATA, MOCK_GBIF_DATA, DWC_TERMS)

    expect(remark).toEqual(MOCK_DIFFERENCE)
  })

  it('has difference on empty and null', () => {
    const original = { foo: null }
    const interpreted = { foo: '' }
    const remark = getRemark(original, interpreted, DWC_TERMS)

    expect(remark).toEqual({})
  })
})