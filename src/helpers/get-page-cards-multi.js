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

  // If the parent page declares a page-level attribute to opt into across-components
  // behavior, honor it when acrossComponents wasn't explicitly set by the caller.
  if (!acrossComponents) {
    const attrAcross =
      parentPage.asciidoc?.attributes?.['page-cards-across-components'] ||
      parentPage.asciidoc?.attributes?.['cards-across-components'] ||
      parentPage.attributes?.['page-cards-across-components'] ||
      parentPage.attributes?.['cards-across-components']
    if (typeof attrAcross !== 'undefined') {
      // treat any value other than the string 'false' as true
      acrossComponents = !(String(attrAcross).toLowerCase() === 'false')
    }
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
        // Determine parent component/version with fallbacks so modules in the
        // same component are detected even when componentVersion is empty.
        const parentCompName =
          parentPage.componentVersion?.name || parentPage.attributes?.['component-name'] || parentPage.component || ''
        const parentCompVersion =
          parentPage.componentVersion?.version || parentPage.attributes?.['component-version'] || parentPage.attributes?.version || ''

        if (parentCompName && src.component !== parentCompName) return
        if (parentCompVersion && src.version !== parentCompVersion) return
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
    // Debug logging when enabled
    try {
      if (process && process.env && process.env.ANTORA_DEBUG_PAGE_CARDS === '1') {
        /* eslint-disable no-console */
        console.log('[get-page-cards-multi] tag=%s -> pages=%d (including padding)', cardsTag, pages.length)
        pages.forEach(function (p, i) {
          console.log('[get-page-cards-multi]   page[%d] title=%s id=%s empty=%s url=%s', i, p.title || '(no-title)', p.id || '(no-id)', !!p.empty, (p.pub && p.pub.url) || '(no-url)')
        })
        /* eslint-enable no-console */
      }
    } catch (e) {
      // ignore
    }
    return pages
  }
  // Build groups for each tag including optional title from parent page attributes
  const groups = cardsTags.map(function (tag) {
    const titleKey = `page-cards-${tag}-title`
    const title = parentPage.asciidoc?.attributes?.[titleKey] || parentPage.attributes?.[titleKey]
    return { tag, title, pages: makePagesForTag(tag) }
  }).filter((g) => g.pages && g.pages.length)

  // More debug: log summary of what we built
  try {
    if (process && process.env && process.env.ANTORA_DEBUG_PAGE_CARDS === '1') {
      /* eslint-disable no-console */
      console.log('[get-page-cards-multi] parent=%s module=%s tags=%s within=%s across=%s groups=%d',
        parentPage.attributes?.['component-name'] || parentPage.componentVersion?.name || parentPage.component || '(unknown)',
        parentPage.module || '(unknown)',
        cardsTags.join(','),
        within,
        acrossComponents,
        groups.length)
      groups.forEach(function (g) {
        console.log('[get-page-cards-multi] group %s -> pages=%d', g.tag, g.pages.length)
      })
      /* eslint-enable no-console */
    }
  } catch (e) {}

  return groups
}
