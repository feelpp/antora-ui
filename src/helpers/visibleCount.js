
'use strict'

module.exports = function () {
  const args = Array.prototype.slice.call(arguments)
  const arr = args[0]
  if (!Array.isArray(arr)) return 0
  return arr.reduce(function (acc, item) {
    if (item && !item.empty) return acc + 1
    return acc
  }, 0)
}
