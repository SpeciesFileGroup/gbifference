import { TOccurrence } from './../types/TOccurrence';

export interface ISource {
  url?: string,
  parameters?: { [key: string]: string },
  headers?: { [key: string]: string }
  dwcObject?: TOccurrence 
}

export interface IConfiguration {
  element?: HTMLElement | string
  occurrenceId?: string
  datasetKey?: string
  source: ISource
}
