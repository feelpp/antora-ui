'use strict'

// Returns a normalized category class name (e.g., 'benchmark', 'example')
// if any of the provided tags (singular or plural) are found on the page.
// Usage in HBS: {{category-from-tags page}}
// Optionally pass a comma-separated allowlist:
//   {{category-from-tags page 'manual,report,benchmark,example,application,machine,usecase,catalog'}}

function split (val) {
  if (!val) return []
  return String(val)
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
}

const CANON = {
  manual: 'manual',
  manuals: 'manual',
  report: 'report',
  reports: 'report',
  benchmark: 'benchmark',
  benchmarks: 'benchmark',
  example: 'example',
  examples: 'example',
  application: 'application',
  applications: 'application',
  machine: 'machine',
  machines: 'machine',
  usecase: 'usecase',
  usecases: 'usecase',
  catalog: 'catalog',
  catalogs: 'catalog',
}

module.exports = function () {
  const args = Array.prototype.slice.call(arguments)
  const options = args[args.length - 1]
  const page = args[0] || (options && options.data && options.data.root && options.data.root.page)
  const allowRaw = args[1]
  const allow = allowRaw ? split(allowRaw).map((t) => CANON[t] || t) : null

  const tags = split(
    page?.asciidoc?.attributes?.['page-tags'] ||
    page?.attributes?.['page-tags'] ||
    page?.attributes?.tags
  ).map((t) => CANON[t] || t)

  if (!tags.length) return ''

  // Preferred order if multiple are present
  const pref = allow || [
    'application',
    'machine',
    'usecase',
    'benchmark',
    'example',
    'report',
    'manual',
    'catalog',
  ]
  for (const key of pref) {
    if (tags.includes(key)) return key
  }
  return ''
}
