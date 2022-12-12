import { IOccurrence, IRemark } from '@/interfaces'

export interface IGbifferenceData {
  dwcRecords: IDwcRecords,
  dwcTerms: Array<string>
  remarks: IRemark,
  inSync: boolean
}

export interface IDwcRecords { 
  [key: string]: IOccurrence 
}