import { TOccurrence } from '@/types'

export interface IEventClickCell {
  event: MouseEvent
  row: TOccurrence[]
  column: string
  value: TOccurrence
}
