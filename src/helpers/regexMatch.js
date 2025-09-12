'use strict'

// regexMatch: (pattern, str) -> boolean
// Accepts either a plain substring or a JS RegExp string (without //).
module.exports = (pattern, str) => {
  if (typeof pattern !== 'string' || typeof str !== 'string') return false
  try {
    // if pattern contains regex meta chars, treat as regex; otherwise simple includes
    const hasMeta = /[.*+?^${}()|[\]\\]/.test(pattern)
    if (hasMeta) {
      const re = new RegExp(pattern)
      return re.test(str)
    }
    return str.indexOf(pattern) !== -1
  } catch (e) {
    return false
  }
}
