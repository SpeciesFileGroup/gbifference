import { TOccurrence, TRemark } from "@/types"
import { DIFFERENCE_TYPES, OCCURRENCE_ATTRIBUTES } from "@/constants"

function getDifference (originalValue: string, gbifValue: string): string {
  if (!originalValue && gbifValue) { return DIFFERENCE_TYPES.Inferred }
  if (originalValue && !gbifValue) { return DIFFERENCE_TYPES.Excluded }
  if (originalValue !== gbifValue) { return DIFFERENCE_TYPES.Altered }

  return ''
}

export function getRemark (original: TOccurrence, gbifSource: TOccurrence): TRemark {
  const remarks: { [attr: string]: string } = {}

  OCCURRENCE_ATTRIBUTES.forEach(attr => {
    const originalValue = original[attr]
    const gbifValue = gbifSource[attr]
    const diff = getDifference(originalValue, gbifValue)

    remarks[attr] = diff
  })

  return remarks
}