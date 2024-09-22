'use strict'

var util = require('handlebars-utils')

/**
 * Replace all occurrences of substring `a` with substring `b`.
 *
 * ```handlebars
 * {{replace "a b a b a b" "a" "z"}}
 * <!-- results in:  'z b z b z b' -->
 * ```
 * @param {String} `str`
 * @param {String} `a`
 * @param {String} `b`
 * @return {String}
 * @api public
 */

module.exports = (str, a, b) => {
  if (!util.isString(str)) return ''
  if (!util.isString(a)) return str
  if (!util.isString(b)) b = ''
  return str.split(a).join(b)
}
