'use strict'

module.exports = (page, { data: { root } }) => {
  const { contentCatalog } = root
  return contentCatalog.getPages(({ asciidoc, out, src }) => {
    if (!out || !asciidoc) return
    if (src.component !== page.componentVersion.name ||
      src.module !== page.module ||
      src.version !== page.componentVersion.version) return
    const pageTags = asciidoc.attributes['page-tags']
    return pageTags && pageTags.split(',').map((v) => v.trim()).includes('case')
  })
}
