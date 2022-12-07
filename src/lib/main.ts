import { TOccurrence } from '@/types';
import { IConfiguration } from "@/interfaces"
import GBifference from "@/gbifference"

function discoverGbifference (selector?: string): Array<App> {
  const tag: string = selector || '[data-gbifference="true"]'
  const elements: NodeListOf<HTMLElement> = document.querySelectorAll(tag)
  const elementsList: Array<HTMLElement> = [...elements]

  return elementsList.map(element => 
    createGbifferenceWidget(element, parseElementOptions(element))
  )
}

function autoDiscover (): void {
  discoverGbifference()
}

function parseDwcObject (dwcObjet: any): TOccurrence {
  try {
    const json = JSON.parse(dwcObjet)

    return json
  } catch(e) {
    throw('Invalid dwcObject')
  }
}


function parseElementOptions (element: HTMLElement): IConfiguration {
  return {
    occurrenceId: element.getAttribute('data-occurrence-id') || undefined,
    datasetKey: element.getAttribute('data-datasetkey') || undefined,
    source: {
      url: element.getAttribute('data-source-url') || undefined,
      dwcObject: parseDwcObject(element.getAttribute('data-dwc-object'))
    }
  }
}

function createGbifferenceWidget (element: HTMLElement | string, opt: IConfiguration) {
  const { occurrenceId, source } = opt

  if (!occurrenceId) {
    throw 'Missing occurrenceID'
  }

  return new GBifference({
    occurrenceId,
    element,
    source
  })
}

window.addEventListener('DOMContentLoaded', autoDiscover)

export { 
  createGbifferenceWidget,
  discoverGbifference,
  GBifference
}