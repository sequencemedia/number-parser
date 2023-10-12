/**
 * https://observablehq.com/@mbostock/localized-number-parsing
 */
export default class NumberParser {
  constructor (locale = 'en-GB') {
    const PARTS = (
      new Intl.NumberFormat(locale, { useGrouping: true }) // true is default
    ).formatToParts(12345.6)

    const CHARS = (
      new Intl.NumberFormat(locale, { useGrouping: false })
    ).format(9876543210).split('').reverse()

    const {
      value: GROUP
    } = PARTS.find(({ type }) => type === 'group')

    const {
      value: DECIMAL
    } = PARTS.find(({ type }) => type === 'decimal')

    const charsMap = new Map(CHARS.map((d, n) => [d, n]))
    const group = new RegExp(`[${GROUP}]`, 'g')
    const decimal = new RegExp(`[${DECIMAL}]`)
    const chars = new RegExp(`[${CHARS.join('')}]`, 'g')

    function fromChar (char) {
      return (
        charsMap.get(char)
      )
    }

    function parse (string) {
      const number = string.trim()
        .replace(group, '')
        .replace(decimal, '.')
        .replace(chars, fromChar)

      return (
        number
          ? Number(number)
          : NaN
      )
    }

    this.fromChar = fromChar
    this.parse = parse
  }
}

export function fromChar (char) {
  const numberParser = new NumberParser()
  return (
    numberParser.fromChar(String(char)) ?? NaN
  )
}

export function toNumber (string) {
  const numberParser = new NumberParser()
  return (
    numberParser.parse(String(string))
  )
}
