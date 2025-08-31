'use strict'

// Simple concat helper: concatenates its arguments into a single string.
// Usage in templates: {{concat 'prefix-' this.tag '-title'}}
module.exports = function () {
  var args = Array.prototype.slice.call(arguments)
  // Handlebars passes an options object as the last arg; drop it
  var last = args[args.length - 1]
  if (last && last.data && last.data.root) args.pop()
  return args.map(function (a) { return (a == null) ? '' : String(a) }).join('')
}
