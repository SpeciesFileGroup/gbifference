import { TOccurrence } from '@/types';
import { IOccurrence, IRemark } from "@/interfaces"
import { DifferenceType } from "@/constants"

function getDifference (
    originalValue: TOccurrence,
    interpretedValue: TOccurrence): string 
{
  if (!originalValue && interpretedValue) { return DifferenceType.Inferred }
  if (originalValue && !interpretedValue) { return DifferenceType.Excluded }
  if (originalValue != interpretedValue) { return DifferenceType.Altered }

  return ''
}

export function getRemark (
  original: IOccurrence, 
  interpreted: IOccurrence, 
  dwcTerms: string[]
): IRemark {
  const remarks: IRemark = {}

  dwcTerms.forEach((attr: string) => {
    const originalValue: TOccurrence = original[attr]
    const interpretedValue: TOccurrence = interpreted[attr]
    const diff = getDifference(originalValue, interpretedValue)

    if (diff) {
      remarks[attr] = diff
    }
  })

  return remarks
}
