import { TOccurrence, TRemark } from "@/types"
import { DIFFERENCE_TYPES, DWC_TERMS } from "@/constants"

function getDifference (
    originalValue: string | null | number,
    interpretedValue: string | null | number): string 
{
  if (!originalValue && interpretedValue) { return DIFFERENCE_TYPES.Inferred }
  if (originalValue && !interpretedValue) { return DIFFERENCE_TYPES.Excluded }
  if (originalValue != interpretedValue) { return DIFFERENCE_TYPES.Altered }

  return ''
}

export function getRemark (original: TOccurrence, interpreted: TOccurrence): TRemark {
  const remarks: { [attr: string]: string } = {}

  DWC_TERMS.forEach(attr => {
    const originalValue = original[attr]
    const interpretedValue = interpreted[attr]
    const diff = getDifference(originalValue, interpretedValue)

    if (diff) {
      remarks[attr] = diff
    }
  })

  return remarks
}
