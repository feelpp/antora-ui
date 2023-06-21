'use strict'

module.exports = ({ data: { root } }) => {
  const { contentCatalog } = root
  const result = []
  const userComponent = contentCatalog.getComponent('user')
  if (userComponent) {
    const { versions } = userComponent
    if (versions && versions.length) {
      // stable
      const startPageUrl = versions[0].navigation[0].items[0].url
      result.push({
        title: 'USER MANUAL',
        color: '#1ddaff',
        id: 'user-manual',
        url: startPageUrl,
      })
    }
  }
  const devComponent = contentCatalog.getComponent('dev')
  if (devComponent) {
    const { versions } = devComponent
    if (versions && versions.length) {
      // stable
      const startPageUrl = versions[0].navigation[0].items[0].url
      result.push({
        title: 'DEV. MANUAL',
        color: '#50377b',
        id: 'dev-manual',
        url: startPageUrl,
      })
    }
  }
  const dataComponent = contentCatalog.getComponent('data')
  if (dataComponent) {
    const { versions } = dataComponent
    if (versions && versions.length) {
      // stable
      const startPageUrl = versions[0].navigation[0].items[0].url
      result.push({
        title: 'DATA MANUAL',
        color: '#0080FF',
        id: 'data-manual',
        url: startPageUrl,
      })
    }
  }
  const femIndexPage = contentCatalog.getById({
    component: 'math',
    version: 'master',
    family: 'page',
    module: 'fem',
    relative: 'index.adoc',
  })
  if (femIndexPage) {
    result.push({
      title: 'FEM',
      color: 'red',
      id: 'fem-book',
      url: femIndexPage.pub.url,
    })
  }
  const hdgIndexPage = contentCatalog.getById({
    component: 'math',
    version: 'master',
    family: 'page',
    module: 'hdg',
    relative: 'index.adoc',
  })
  if (hdgIndexPage) {
    result.push({
      title: 'HDG',
      color: 'magenta',
      id: 'hdg-book',
      url: femIndexPage.pub.url,
    })
  }
  return result
}
