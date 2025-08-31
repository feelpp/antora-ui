'use strict'

function splitTags (val) {
  if (!val) return []
  return String(val)
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
}

module.exports = function () {
  // backward-compatible argument parsing:
  // (parentPage, tags, withinParentModule = true, acrossComponents = false, options)
  const args = Array.prototype.slice.call(arguments)
  const options = args[args.length - 1]
  const root = options && options.data && options.data.root
  const { contentCatalog } = root || {}

  const parentPage = args[0]
  const tags = args[1]
  let withinParentModule = args[2]
  let acrossComponents = false
  if (args.length >= 5) {
    acrossComponents = !!args[3]
  } else if (typeof args[3] === 'boolean') {
    // helper was called with 4 args and no options (unlikely), but handle it
    acrossComponents = !!args[3]
  }

  if (withinParentModule === undefined) withinParentModule = true

  // Determine array of requested tags: prefer page-cards-tag, fallback to cards-tag, fallback to argument
  const cardsTagRaw =
    parentPage.asciidoc?.attributes?.['page-cards-tag'] ||
    parentPage.asciidoc?.attributes?.['cards-tag'] ||
    parentPage.attributes?.['page-cards-tag'] ||
    parentPage.attributes?.['cards-tag'] ||
    tags

  const cardsTags = splitTags(cardsTagRaw || '')
  if (!cardsTags.length) return []

  // Parent tags: prefer page-tags, fallback to tags
  const parentTags =
    splitTags(
      parentPage.asciidoc?.attributes?.['page-tags'] ||
      parentPage.attributes?.['page-tags'] ||
      parentPage.attributes.tags
    )

  const within = (withinParentModule === true) || String(withinParentModule) !== 'false'

  const makePagesForTag = function (cardsTag) {
    const pages = contentCatalog.getPages(function ({ asciidoc, out, src }) {
      if (!out || !asciidoc) return
      // if acrossComponents is false, restrict to same component/version as the parent page
      if (!acrossComponents) {
        if (src.component !== parentPage.componentVersion.name) return
        if (src.version !== parentPage.componentVersion.version) return
      }
      if (within && src.module !== parentPage.module) return

      // Prefer page-tags, fallback to tags
      const pageTags = splitTags(
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

  // Build groups for each tag including optional title from parent page attributes
  const groups = cardsTags.map(function (tag) {
    const titleKey = `page-cards-${tag}-title`
    const title = parentPage.asciidoc?.attributes?.[titleKey] || parentPage.attributes?.[titleKey]
    return { tag, title, pages: makePagesForTag(tag) }
  }).filter((g) => g.pages && g.pages.length)

  return groups
}
