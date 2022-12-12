import { IOccurrence } from '@/interfaces'

export interface IConfiguration {
  element?: HTMLElement | string
  occurrenceId?: string
  datasetKey?: string
  source: ISource
}

export interface ISource {
  url?: string,
  parameters?: { [key: string]: string },
  headers?: { [key: string]: string }
  dwcObject?: IOccurrence 
}