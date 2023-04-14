'use strict'

var util = require('handlebars-utils')

module.exports = (str, b) => {
  if (!util.isString(str)) return ''
  if (!util.isString(b)) b = ''
  return str + b
}
