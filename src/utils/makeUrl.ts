export function buildGetUrl (url: string, extraParams = {}): string {
  return `${url}${stringifyApiParams(extraParams)}`
}

function stringifyApiParams (object: { [key: string]: string } = {}): string {
  const entries = Object.entries(object)
  const queryString = entries
    .map(([param, value]) => `${param}=${value}`)
    .join('&')

  return entries.length
    ? `?${queryString}`
    : ''
}
