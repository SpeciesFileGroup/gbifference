import { TTableRow } from '@/types';
import { ITable, IConfiguration } from "@/interfaces"
import { EventEmitter } from "@/utils"
import { makeTableObj } from '@/utils'
import { EventList } from '@/constants'
import { IEventClickCell } from '@/interfaces'
import gbifference from '@/gbifference'

export class TableGbifference extends EventEmitter {
  element: HTMLElement
  table: ITable = {
    headers: [],
    rows: []
  }

  constructor (element: HTMLElement | string, options: IConfiguration) {
    super()
    this.element = typeof element === 'string' 
      ? document.querySelector(element) as HTMLElement
      : element
    
    if (!this.element) {
      throw(`Element doesn't exist`)
    }

    gbifference(options).then(data => {
      this.table = makeTableObj(data)
      this.renderTable(this.element)
    })
  }

  renderTable (element: HTMLElement) {
    const tableElement = document.createElement('table')
    const tbodyElement = document.createElement('tbody')
    const { rows, headers } = this.table

    tableElement.classList.add('table-gbifference')

    tableElement.appendChild(this.createHeader(headers))
    tableElement.appendChild(tbodyElement)
    
    rows.forEach((data: TTableRow[]) => {
      tbodyElement.appendChild(this.createRowElement(data, headers))
    })

    element.innerHTML = ''
    element.appendChild(tableElement)

    return tableElement
  }

  createRowElement (data: TTableRow[], columns: string[]): HTMLElement {
    const rowElement: HTMLElement = document.createElement('tr')
    
    data.forEach((value: TTableRow, index: number) => {
      const cellElement = document.createElement('td')

      cellElement.innerHTML = value ? String(value) : ''
      rowElement.appendChild(cellElement)

      cellElement.addEventListener('click', e => { 
        const event: IEventClickCell = {
          event: e,
          row: data,
          column: columns[index],
          value
        }

        this.emit(EventList.ClickCell, event) 
      })
    })

    return rowElement
  }

  createHeader (headers: string[]): HTMLElement {
    const theadElement: HTMLElement = document.createElement('thead')
    const rowHeader: HTMLElement = document.createElement('tr')

    headers.forEach((h: string) => {
      const thElement = document.createElement('th')

      thElement.innerHTML = h
      rowHeader.appendChild(thElement)
    })

    theadElement.append(rowHeader)

    return theadElement
  }
}