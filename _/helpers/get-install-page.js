'use strict'

module.exports = (version, { data: { root } }) => {
  const { contentCatalog } = root
  return contentCatalog.getById({
    component: 'user',
    version: version,
    family: 'page',
    module: 'install',
    relative: 'index.adoc',
  })
}
