'use strict'

module.exports = function (page, name) {
  if (!page || !name) return false

  return isTruthy(getAttr(page, name)) || isTruthy(getAttr(page, `page-${name}`))
}

function getAttr (page, name) {
  return (page.attributes && page.attributes[name]) ||
    (page.asciidoc && page.asciidoc.attributes && page.asciidoc.attributes[name])
}

function isTruthy (value) {
  if (value === undefined || value === null || value === false) return false
  if (value === true) return true
  const normalized = String(value).trim().toLowerCase()
  return normalized !== '' &&
    normalized !== 'false' &&
    normalized !== 'no' &&
    normalized !== 'off' &&
    normalized !== '0'
}
