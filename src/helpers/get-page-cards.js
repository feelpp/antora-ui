'use strict'

function splitTags (val) {
  if (!val) return []
  return String(val)
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
}

module.exports = function (parentPage, tag, withinParentModule = true, { data: { root } }) {
  const { contentCatalog } = root

  // Prefer page-cards-tag, fallback to cards-tag, fallback to argument
  const cardsTag =
    parentPage.asciidoc?.attributes?.['page-cards-tag'] ||
    parentPage.asciidoc?.attributes?.['cards-tag'] ||
    parentPage.attributes?.['page-cards-tag'] ||
    parentPage.attributes?.['cards-tag'] ||
    tag

  // Parent tags: prefer page-tags, fallback to tags
  const parentTags =
    splitTags(
      parentPage.asciidoc?.attributes?.['page-tags'] ||
      parentPage.attributes?.['page-tags'] ||
      parentPage.attributes.tags
    )

  const pages = contentCatalog.getPages(function ({ asciidoc, out, src }) {
    if (!out || !asciidoc) return
    // Determine parent component/version with fallbacks so modules in the
    // same component are detected even when componentVersion is empty.
    const parentCompName =
      parentPage.componentVersion?.name || parentPage.attributes?.['component-name'] || parentPage.component || ''
    const parentCompVersion =
      parentPage.componentVersion?.version || parentPage.attributes?.['component-version'] || parentPage.attributes?.version || ''

    if (parentCompName && src.component !== parentCompName) return
    if (parentCompVersion && src.version !== parentCompVersion) return
    if (withinParentModule && src.module !== parentPage.module) return

    // Prefer page-tags, fallback to tags
    const pageTags =
      splitTags(
        asciidoc.attributes['page-tags'] ||
        asciidoc.attributes.tags
      )

    // Only include if the page has the desired tag
    if (!pageTags.includes(cardsTag)) return

    // If the page declares parent-catalogs, enforce that at least one of those
    // parent-catalog names matches a tag on the parent page. This prevents
    // manuals that belong to other catalogs from showing up in this catalog.
    const parentCatalogs =
      splitTags(
        asciidoc.attributes['parent-catalogs'] ||
        asciidoc.attributes['page-parent-catalogs']
      )
    if (
      parentCatalogs.length &&
      !parentCatalogs.some(function (cat) { return parentTags.includes(cat) })
    ) {
      return
    }

    return true
  }).sort(function (a, b) {
    // Sort by page-cards-order if present, otherwise by title
    const aOrder = a.asciidoc?.attributes?.['page-cards-order']
    const bOrder = b.asciidoc?.attributes?.['page-cards-order']
    if (aOrder !== undefined && bOrder !== undefined) {
      const aNum = Number(aOrder)
      const bNum = Number(bOrder)
      if (!isNaN(aNum) && !isNaN(bNum) && aNum !== bNum) return aNum - bNum
    } else if (aOrder !== undefined) {
      return -1
    } else if (bOrder !== undefined) {
      return 1
    }
    return (a.title || '').localeCompare(b.title || '')
  })

  // Pad to 3-column grid
  if (pages && pages.length > 0) {
    while (pages.length % 3 !== 0) {
      pages.push({
        empty: true,
        title: 'MANUAL',
        color: '#1dffbf',
        id: 'manual',
      })
    }
  }
  return pages
}
