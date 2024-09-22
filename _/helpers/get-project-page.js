'use strict'

module.exports = (relative, { data: { root } }) => {
  const { contentCatalog } = root
  return contentCatalog.getById({
    component: 'feelpp-project',
    family: 'page',
    module: 'ROOT',
    relative: relative,
  })
}
