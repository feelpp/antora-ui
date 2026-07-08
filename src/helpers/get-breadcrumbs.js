'use strict'

module.exports = function (page, options) {
  if (!page) return []

  const breadcrumbs = Array.isArray(page.breadcrumbs) ? page.breadcrumbs.slice() : []
  const parentSpecAttr = getAttr(page, 'parent') ||
    getAttr(page, 'page-parent') ||
    getAttr(page, 'parent-page') ||
    getAttr(page, 'breadcrumb-parent') ||
    getAttr(page, 'page-breadcrumb-parent')

  if (!parentSpecAttr) return breadcrumbs

  const root = options && options.data && options.data.root
  const contentCatalog = root && root.contentCatalog
  if (!contentCatalog) return breadcrumbs

  const parentTitleAttr = getAttr(page, 'parent-title') ||
    getAttr(page, 'page-parent-title') ||
    getAttr(page, 'parent-page-title') ||
    getAttr(page, 'breadcrumb-parent-title') ||
    getAttr(page, 'page-breadcrumb-parent-title')

  const parentTitles = splitAttr(parentTitleAttr)
  const parentItems = splitAttr(parentSpecAttr)
    .map((spec, idx) => resolveParent(spec, parentTitles[idx], page, contentCatalog))
    .filter(Boolean)

  if (!parentItems.length) return breadcrumbs

  const existingUrls = new Set(breadcrumbs.map((item) => item && item.url).filter(Boolean))
  const missingParentItems = parentItems.filter((item) => !existingUrls.has(item.url))
  if (!missingParentItems.length) return breadcrumbs

  const currentIndex = findCurrentBreadcrumbIndex(breadcrumbs, page)
  if (~currentIndex) {
    return breadcrumbs
      .slice(0, currentIndex)
      .concat(missingParentItems, breadcrumbs.slice(currentIndex))
  }

  return breadcrumbs.concat(missingParentItems)
}

function getAttr (page, name) {
  return (page.asciidoc && page.asciidoc.attributes && page.asciidoc.attributes[name]) ||
    (page.attributes && page.attributes[name])
}

function splitAttr (value) {
  if (!value) return []
  return String(value)
    .split(/[;,]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function resolveParent (rawSpec, fallbackTitle, page, contentCatalog) {
  let spec = rawSpec
  let title = fallbackTitle
  const bracketMatch = rawSpec.match(/^(.*)\[([^\]]+)\]$/)
  if (bracketMatch) {
    spec = bracketMatch[1].trim()
    title = title || bracketMatch[2].trim()
  }
  if (!spec) return

  const context = {}
  if (page.component && page.component.name) context.component = page.component.name
  if (page.version) context.version = page.version
  if (page.module) context.module = page.module

  let parentFile
  try {
    parentFile = contentCatalog.resolvePage(spec, context)
  } catch (e) {
    return
  }
  if (!parentFile || !parentFile.pub || !parentFile.pub.url || parentFile.pub.url === page.url) return

  return {
    content: title || getPageTitle(parentFile) || spec,
    url: parentFile.pub.url,
    urlType: 'internal',
  }
}

function getPageTitle (file) {
  const asciidoc = file.asciidoc || {}
  const attrs = asciidoc.attributes || {}
  return asciidoc.navtitle || attrs.navtitle || asciidoc.doctitle || attrs.doctitle
}

function findCurrentBreadcrumbIndex (breadcrumbs, page) {
  if (!breadcrumbs.length) return -1
  const currentUrl = page.url
  const currentTitle = page.title
  return breadcrumbs.findIndex((item) => {
    return (currentUrl && item.url === currentUrl) || (currentTitle && item.content === currentTitle)
  })
}
