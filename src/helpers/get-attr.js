module.exports = function (page, name, fallback) {
  // Try AsciiDoc attributes first
  if (page && page.asciidoc && page.asciidoc.attributes && page.asciidoc.attributes[name] !== undefined) {
    return page.asciidoc.attributes[name]
  }
  // Then try page.attributes (legacy)
  if (page && page.attributes && page.attributes[name] !== undefined) {
    return page.attributes[name]
  }
  // Fallback
  return fallback
}
