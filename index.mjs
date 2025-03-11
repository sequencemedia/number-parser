/**
 * https://observablehq.com/@mbostock/localized-number-parsing
 */

function findGroup ({ type }) {
  return type === 'group'
}

function findDecimal ({ type }) {
  return type === 'decimal'
}

export default class NumberParser {
  constructor (locale = 'en-GB') {
    const PARTS = (
      new Intl.NumberFormat(locale) // `{ useGrouping: true }` is default
    ).formatToParts(12345.6)

    const {
      value: GROUP
    } = PARTS.find(findGroup)

    const {
      value: DECIMAL
    } = PARTS.find(findDecimal)

    const CHARS = (
      new Intl.NumberFormat(locale, { useGrouping: false })
    ).format(9876543210).split('').reverse()

    const group = new RegExp(`[${GROUP}]`, 'g')
    const decimal = new RegExp(`[${DECIMAL}]`)
    const chars = new RegExp(`[${CHARS.join('')}]`, 'g')
    const charNumberMap = new Map(CHARS.map((d, n) => [d, n]))

    function fromString (string) {
      return (
        string.trim()
          .replace(group, '')
          .replace(decimal, '.')
          .replace(chars, getNumberFor)
      )
    }

    function getNumberFor (char) {
      return (
        charNumberMap.get(char)
      )
    }

    function toNumber (string) {
      return (
        string
          ? Number(string)
          : NaN
      )
    }

    /**
     * Parse `value` to a number or NaN
     *
     * @param {any} value
     * @returns {number} A number or NaN
     */
    this.parse = function parse (value) {
      return (
        toNumber(
          fromString(
            String(value)
          )
        )
      )
    }
  }
}

export function parse (value, locale) {
  const numberParser = new NumberParser(locale)

  return (
    numberParser.parse(value)
  )
}
