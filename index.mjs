/**
 * https://observablehq.com/@mbostock/localized-number-parsing
 */
export default class NumberParser {
  constructor (locale = 'en-GB') {
    const PARTS = (
      new Intl.NumberFormat(locale) // `{ useGrouping: true }` is default
    ).formatToParts(12345.6)

    const {
      value: GROUP
    } = PARTS.find(({ type }) => type === 'group')

    const {
      value: DECIMAL
    } = PARTS.find(({ type }) => type === 'decimal')

    const CHARS = (
      new Intl.NumberFormat(locale, { useGrouping: false })
    ).format(9876543210).split('').reverse()

    const group = new RegExp(`[${GROUP}]`, 'g')
    const decimal = new RegExp(`[${DECIMAL}]`)
    const chars = new RegExp(`[${CHARS.join('')}]`, 'g')
    const charNumberMap = new Map(CHARS.map((d, n) => [d, n]))

    function getNumberFor (char) {
      return (
        charNumberMap.get(char)
      )
    }

    function fromString (string) {
      return (
        string.trim()
          .replace(group, '')
          .replace(decimal, '.')
          .replace(chars, getNumberFor)
      )
    }

    function toNumber (string) {
      return (
        string
          ? Number(string)
          : NaN
      )
    }

    function parse (string) {
      return toNumber(fromString(string))
    }

    this.parse = parse
  }
}

export function parse (string) {
  const numberParser = new NumberParser()
  return (
    numberParser.parse(String(string))
  )
}
