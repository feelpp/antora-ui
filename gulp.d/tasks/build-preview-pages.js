'use strict'

const Asciidoctor = require('@asciidoctor/core')()
const fs = require('fs-extra')
const handlebars = require('handlebars')
const merge = require('merge-stream')
const ospath = require('path')
const path = ospath.posix
const requireFromString = require('require-from-string')
const { Transform } = require('stream')
const map = (transform = () => {}, flush = undefined) => new Transform({ objectMode: true, transform, flush })
const vfs = require('vinyl-fs')
const yaml = require('js-yaml')
const iconPacks = {
  fas: (() => {
    try {
      return require('@fortawesome/pro-solid-svg-icons')
    } catch (e) {
      return require('@fortawesome/free-solid-svg-icons')
    }
  })(),
  far: (() => {
    try {
      return require('@fortawesome/pro-regular-svg-icons')
    } catch (e) {
      return require('@fortawesome/free-regular-svg-icons')
    }
  })(),
  fab: require('@fortawesome/free-brands-svg-icons'),
}
iconPacks.fa = iconPacks.fas
const iconShims = require('@fortawesome/fontawesome-free/js/v4-shims').reduce((accum, it) => {
  accum['fa-' + it[0]] = [it[1] || 'fas', 'fa-' + (it[2] || it[0])]
  return accum
}, {})

const ASCIIDOC_ATTRIBUTES = { experimental: '', icons: 'font', sectanchors: '', 'source-highlighter': 'highlight.js' }

module.exports = (src, previewSrc, previewDest, sink = () => map()) => (done) =>
  Promise.all([
    loadSampleUiModel(previewSrc),
    toPromise(
      merge(compileLayouts(src), registerPartials(src), registerHelpers(src), copyImages(previewSrc, previewDest))
    ),
  ])
    .then(([baseUiModel, { layouts }]) => [{ ...baseUiModel, env: process.env }, layouts])
    .then(([baseUiModel, layouts, iconDefs = new Map()]) =>
      vfs
        .src('**/*.adoc', { base: previewSrc, cwd: previewSrc })
        .pipe(
          map((file, enc, next) => {
            const siteRootPath = path.relative(ospath.dirname(file.path), ospath.resolve(previewSrc))
            const uiModel = { ...baseUiModel }
            uiModel.page = { ...uiModel.page }
            uiModel.siteRootPath = siteRootPath
            uiModel.uiRootPath = path.join(siteRootPath, '_')
            if (file.stem === '404') {
              uiModel.page = { layout: '404', title: 'Page Not Found' }
            } else {
              const doc = Asciidoctor.load(file.contents, { safe: 'safe', attributes: ASCIIDOC_ATTRIBUTES })
              uiModel.page.attributes = Object.entries(doc.getAttributes())
                .filter(([name, val]) => name.startsWith('page-'))
                .reduce((accum, [name, val]) => {
                  accum[name.substr(5)] = val
                  return accum
                }, {})
              uiModel.page.layout = doc.getAttribute('page-layout', 'default')
              uiModel.page.title = doc.getDocumentTitle()
              uiModel.page.contents = Buffer.from(doc.convert())
            }
            file.extname = '.html'
            try {
              file.contents = Buffer.from(layouts.get(uiModel.page.layout)(uiModel))
              registerIconDefs(iconDefs, file)
              next(null, file)
            } catch (e) {
              next(transformHandlebarsError(e, uiModel.page.layout))
            }
          },
          // NOTE parallel build overwrites default fontawesome-icon-defs.js, so we must use an alternate path
          () =>
            fs
              .readFile(ospath.join(src, 'js/vendor/fontawesome-icon-defs.js'), 'utf8')
              .then((contents) => registerIconDefs(iconDefs, { contents }))
              .then(() => writeIconDefs(iconDefs, ospath.join(previewDest, 'fontawesome-icon-defs.js')))
          )
        )
        .pipe(vfs.dest(previewDest))
        .on('error', done)
        .pipe(sink())
    )

function loadSampleUiModel (src) {
  return fs.readFile(ospath.join(src, 'ui-model.yml'), 'utf8').then((contents) => yaml.safeLoad(contents))
}

function registerIconDefs (iconDefs, file) {
  const contents = file.contents
  let iconNames = []
  if (!file.path) {
    try {
      iconNames = JSON.parse(contents.match(/\biconNames: *(\[.*?\])/)[1].replace(/'/g, '"'))
    } catch (e) {}
  } else if (contents.includes('<i class="fa')) {
    iconNames = contents
      .toString()
      .match(/<i class="fa[brs]? fa-[^" ]+/g)
      .map((it) => it.substr(10))
  }
  if (!iconNames.length) return
  ;[...new Set(iconNames)].reduce((accum, iconKey) => {
    if (!accum.has(iconKey)) {
      const [iconPrefix, iconName] = iconKey.split(' ').slice(0, 2)
      let iconDef = (iconPacks[iconPrefix] || {})[camelCase(iconName)]
      if (iconDef) {
        return accum.set(iconKey, { ...iconDef, prefix: iconPrefix })
      } else if (iconPrefix === 'fa') {
        const [realIconPrefix, realIconName] = iconShims[iconName] || []
        if (
          realIconName &&
          !accum.has((iconKey = `${realIconPrefix} ${realIconName}`)) &&
          (iconDef = (iconPacks[realIconPrefix] || {})[camelCase(realIconName)])
        ) {
          return accum.set(iconKey, { ...iconDef, prefix: realIconPrefix })
        }
      }
    }
    return accum
  }, iconDefs)
}

function writeIconDefs (iconDefs, to) {
  return fs.writeFile(to, `window.FontAwesomeIconDefs = ${JSON.stringify([...iconDefs.values()])}\n`, 'utf8')
}

function registerPartials (src) {
  return vfs.src('partials/*.hbs', { base: src, cwd: src }).pipe(
    map((file, enc, next) => {
      handlebars.registerPartial(file.stem, file.contents.toString())
      next()
    })
  )
}

function registerHelpers (src) {
  handlebars.registerHelper('resolvePage', resolvePage)
  handlebars.registerHelper('resolvePageURL', resolvePageURL)
  return vfs.src('helpers/*.js', { base: src, cwd: src }).pipe(
    map((file, enc, next) => {
      handlebars.registerHelper(file.stem, requireFromString(file.contents.toString()))
      next()
    })
  )
}

function compileLayouts (src) {
  const layouts = new Map()
  return vfs.src('layouts/*.hbs', { base: src, cwd: src }).pipe(
    map(
      (file, enc, next) => {
        const srcName = path.join(src, file.relative)
        layouts.set(file.stem, handlebars.compile(file.contents.toString(), { preventIndent: true, srcName }))
        next()
      },
      function (done) {
        this.push({ layouts })
        done()
      }
    )
  )
}

function copyImages (src, dest) {
  return vfs
    .src('**/*.{png,svg}', { base: src, cwd: src })
    .pipe(vfs.dest(dest))
    .pipe(map((file, enc, next) => next()))
}

function resolvePage (spec, context = {}) {
  if (spec) return { pub: { url: resolvePageURL(spec) } }
}

function resolvePageURL (spec, context = {}) {
  if (spec) return '/' + (spec = spec.split(':').pop()).slice(0, spec.lastIndexOf('.')) + '.html'
}

function transformHandlebarsError ({ message, stack }, layout) {
  const m = stack.match(/^ *at Object\.ret \[as (.+?)\]/m)
  const templatePath = `src/${m ? 'partials/' + m[1] : 'layouts/' + layout}.hbs`
  const err = new Error(`${message}${~message.indexOf('\n') ? '\n^ ' : ' '}in UI template ${templatePath}`)
  err.stack = [err.toString()].concat(stack.substr(message.length + 8)).join('\n')
  return err
}

function toPromise (stream) {
  return new Promise((resolve, reject, data = {}) =>
    stream
      .on('error', reject)
      .on('data', (chunk) => chunk.constructor === Object && Object.assign(data, chunk))
      .on('finish', () => resolve(data))
  )
}

function camelCase (str) {
  return str.replace(/-(.)/g, (_, l) => l.toUpperCase())
}
