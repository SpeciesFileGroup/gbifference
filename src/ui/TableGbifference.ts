import { TTableRow } from '@/types'
import { ITable, ITableConfiguration } from '@/interfaces'
import { EventEmitter } from '@/utils'
import { makeTableObj } from '@/utils'
import { DifferenceType, EventList, TableColumn } from '@/constants'
import { IEventClickCell } from '@/interfaces'
import gbifference from '@/gbifference'

const RemarkModifier: Record<DifferenceType, string> = {
  [DifferenceType.Inferred]: 'inferred',
  [DifferenceType.Altered]: 'altered',
  [DifferenceType.Excluded]: 'excluded'
}

export class TableGbifference extends EventEmitter {
  element: HTMLElement
  table: ITable = {
    headers: [],
    rows: []
  }

  constructor(element: HTMLElement | string, options: ITableConfiguration) {
    super()
    this.element =
      typeof element === 'string'
        ? (document.querySelector(element) as HTMLElement)
        : element

    if (!this.element) {
      throw `Element doesn't exist`
    }

    gbifference(options).then((data) => {
      this.table = makeTableObj(data, options)
      this.renderTable(this.element)
    })
  }

  renderTable(element: HTMLElement) {
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

  createRowElement(data: TTableRow[], columns: string[]): HTMLElement {
    const rowElement: HTMLElement = document.createElement('tr')

    data.forEach((value: TTableRow, index: number) => {
      const cellElement = document.createElement('td')
      const isRemark = columns[index] === TableColumn.Remarks

      if (isRemark) {
        cellElement.classList.add('table-gbifference__remark-cell')
      }

      cellElement.appendChild(
        isRemark ? this.renderRemark(value) : this.renderValue(value)
      )
      rowElement.appendChild(cellElement)

      cellElement.addEventListener('click', (e) => {
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

  renderRemark(value: TTableRow): Node {
    const modifier = RemarkModifier[value as DifferenceType]

    if (!modifier) {
      return this.renderValue(value)
    }

    const remarkElement = document.createElement('span')

    remarkElement.classList.add(
      'table-gbifference__remark',
      `table-gbifference__remark--${modifier}`
    )
    remarkElement.textContent = String(value)

    return remarkElement
  }

  renderValue(value: unknown): Node {
    if (value === null || value === undefined) {
      return document.createTextNode('')
    }

    if (typeof value === 'object') {
      const pre = document.createElement('pre')
      pre.classList.add('table-gbifference__json')
      pre.appendChild(this.linkify(JSON.stringify(value, null, 2)))
      return pre
    }

    return this.linkify(String(value))
  }

  linkify(text: string): Node {
    const fragment = document.createDocumentFragment()
    const urlPattern = /https?:\/\/[^\s"'<>)]+/g
    let lastIndex = 0
    let match: RegExpExecArray | null

    while ((match = urlPattern.exec(text)) !== null) {
      if (match.index > lastIndex) {
        fragment.appendChild(
          document.createTextNode(text.slice(lastIndex, match.index))
        )
      }

      fragment.appendChild(this.createLink(match[0]))
      lastIndex = urlPattern.lastIndex
    }

    if (lastIndex < text.length) {
      fragment.appendChild(document.createTextNode(text.slice(lastIndex)))
    }

    return fragment
  }

  createLink(url: string): HTMLAnchorElement {
    const link = document.createElement('a')
    link.href = url
    link.textContent = url

    link.addEventListener('click', (e) => e.stopPropagation())

    return link
  }

  createHeader(headers: string[]): HTMLElement {
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
