'use strict'

module.exports = (parentPage, tag, withinParentModule = true, { data: { root } }) => {
  const { contentCatalog } = root
  let order = 1
  const pages = contentCatalog.getPages(({ asciidoc, out, src }) => {
    if (!out || !asciidoc) return
    if (src.component !== parentPage.componentVersion.name ||
      (withinParentModule && src.module !== parentPage.module) ||
      src.version !== parentPage.componentVersion.version) return
    const pageTags = asciidoc.attributes['page-tags']
    if (pageTags && pageTags.split(',').map((tag) => tag.trim()).includes('descending')) {
      order = -1
    }
    if (pageTags && pageTags.split(',').map((tag) => tag.trim()).includes('catalog') &&
      parentPage.attributes.tags && asciidoc.attributes['parent-catalogs'] &&
      asciidoc.attributes['parent-catalogs'].split(',').map((parentCat) => parentCat.trim()).every((parentCat) =>
        !parentPage.attributes.tags.split(',').map((parentTag) => parentTag.trim()).includes(parentCat)
      )
    ) return
    return pageTags && pageTags.split(',').map((v) => v.trim()).includes(tag)
  })

  if (pages) {
    pages.sort((a, b) => {
      // Tag "descending" to set the order of display the cards. By default in increasing order.
      // if the tag is provided, then they are displayed in decreasing order.
      // const order = (pageTags && pageTags.split(',').map((tag) => tag.trim()).includes('descending')) ? -1 : 1
      return order * (a.title || '').localeCompare(b.title || '')
    })

    if (pages.length > 0) {
      while (pages.length % 3 !== 0) {
        pages.push({
          empty: true,
          title: 'MANUAL',
          color: '#1dffbf',
          id: 'manual',
          //url: page.pub.url,
        })
      }
    }
  }
  return pages
}
