'use strict'

/**
 * Checks if a string is a font icon spec
 * @param {string} spec
 * @returns {boolean}
 */

module.exports = (spec) => {
  if (typeof spec !== 'string') return false

  // If looks like filepath (contains dot) then return false.
  // Font icons don't have dots in their names.
  if (spec.includes('.')) return false

  return /^(fa|fas|far|fal|fab)(\s|-|$)/.test(spec.trim())
}
