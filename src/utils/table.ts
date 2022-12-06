import { ITable } from "@/interfaces"

export function createOccurrenceTable (element: HTMLElement, { headers, dwcAttributes }: ITable) {

  function renderTable (element: HTMLElement) {
    const tableElement = document.createElement('table')
    const tbodyElement = document.createElement('tbody')

    tableElement.appendChild(createHeader(['attributes', ...headers]))
    tableElement.appendChild(tbodyElement)
    
    for (const attr in dwcAttributes) {
      const values = Object.values(dwcAttributes[attr])

      tbodyElement.appendChild(createRowElement([attr, ...values]))
    }

    element.innerHTML = ''
    element.appendChild(tableElement)

    return tableElement
  }

  function createRowElement (data): HTMLElement {
    const rowElement: HTMLElement = document.createElement('tr')
    
    data.forEach((value: string) => {
      const cellElement = document.createElement('td')

      cellElement.innerHTML = value
      rowElement.appendChild(cellElement)
    })

    return rowElement
  }

  function createHeader (headers): HTMLElement {
    const theadElement = document.createElement('thead')
    const rowHeader = document.createElement('tr')

    headers.forEach((h: string) => {
      const thElement = document.createElement('th')

      thElement.innerHTML = h
      rowHeader.appendChild(thElement)
    })

    theadElement.append(rowHeader)

    return theadElement
  }

  return renderTable(element)
}