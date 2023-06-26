'use strict'

module.exports = ({ data: { root } }) => {
  const { contentCatalog } = root
  const result = []
  const userComponent = contentCatalog.getComponent('user')
  if (userComponent) {
    if ('latest' in userComponent) {
      // stable
      const startPageUrl = userComponent.latest.navigation[0].items[0].url
      result.push({
        title: 'USER MANUAL',
        color: '#1ddaff',
        id: 'user-manual',
        url: startPageUrl,
      })
    }
  }
  const tbComponent = contentCatalog.getComponent('toolboxes')
  if (tbComponent) {
    if ('latest' in tbComponent) {
      // stable
      const startPageUrl = tbComponent.latest.navigation[0].items[0].url
      result.push({
        title: 'TOOLBOXES MANUAL',
        color: '#1dffbf',
        id: 'toolboxes-manual',
        url: startPageUrl,
      })
    }
  }
  const casesComponent = contentCatalog.getComponent('cases')
  if (casesComponent) {
    if ('latest' in casesComponent) {
      // stable
      const startPageUrl = casesComponent.latest.navigation[0].items[0].url
      result.push({
        title: 'TOOLBOXES CASE STUDIES',
        color: '#1dffbf',
        id: 'cases-manual',
        url: startPageUrl,
      })
    }
  }
  const devComponent = contentCatalog.getComponent('dev')
  if (devComponent) {
    if ('latest' in devComponent) {
      // stable
      const startPageUrl = devComponent.latest.navigation[0].items[0].url
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
    if ('latest' in dataComponent) {
      // stable
      const startPageUrl = dataComponent.latest.navigation[0].items[0].url
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
