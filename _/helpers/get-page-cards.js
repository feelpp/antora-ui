'use strict'

module.exports = (parentPage, tag, withinParentModule = true, { data: { root } }) => {
  const { contentCatalog } = root
  const pages = contentCatalog.getPages(({ asciidoc, out, src }) => {
    if (!out || !asciidoc) return
    if (src.component !== parentPage.componentVersion.name ||
      (withinParentModule && src.module !== parentPage.module) ||
      src.version !== parentPage.componentVersion.version) return
    const pageTags = asciidoc.attributes['page-tags']
    return pageTags && pageTags.split(',').map((v) => v.trim()).includes(tag)
  })
  if (pages && pages.length > 0) {
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
  return pages
}
