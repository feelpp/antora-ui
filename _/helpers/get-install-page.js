'use strict'

module.exports = (version, { data: { root } }) => {
  const { contentCatalog } = root
  if (version === 'stable') {
    // find latest stable version
    const userComponent = contentCatalog.getComponent('user')
    const componentVersions = userComponent.versions
    if (componentVersions.length > 0) {
      const stableVersion = componentVersions[1].version
      const page = contentCatalog.getById({
        component: 'user',
        version: stableVersion,
        family: 'page',
        module: 'install',
        relative: 'index.adoc',
      })
      if (page) {
        return {
          ...page,
          version: stableVersion,
        }
      }
      return page
    }
    return undefined
  }
  return contentCatalog.getById({
    component: 'user',
    version: version,
    family: 'page',
    module: 'install',
    relative: 'index.adoc',
  })
}
