'use strict'

const autoprefixer = require('autoprefixer')
const browserify = require('browserify')
const buffer = require('vinyl-buffer')
const concat = require('gulp-concat')
const fs = require('fs-extra')
const merge = require('merge-stream')
const ospath = require('path')
const path = ospath.posix
const postcss = require('gulp-postcss')
const postcssCalc = require('postcss-calc')
const postcssImport = require('postcss-import')
const postcssUrl = require('postcss-url')
const postcssVar = require('postcss-custom-properties')
const { Transform } = require('stream')
const uglify = require('gulp-uglify')
const vfs = require('vinyl-fs')

const map = (transform) => new Transform({ objectMode: true, transform })
const through = () => map((file, enc, next) => next(null, file))

/**
 * Export a function that creates the build task.
 * This async function dynamically imports gulp-imagemin, its plugins, and cssnano (all ESM)
 * and uses the updated cssnano API.
 */
module.exports = (src, dest, preview) => {
  return async function buildTask () {
    // Dynamically import gulp-imagemin and individual imagemin plugins.
    const { default: imagemin } = await import('gulp-imagemin')
    const { default: gifsicle } = await import('imagemin-gifsicle')
    const { default: jpegtran } = await import('imagemin-jpegtran')
    const { default: optipng } = await import('imagemin-optipng')
    const { default: svgo } = await import('imagemin-svgo')
    // Dynamically import cssnano.
    const { default: cssnanoModule } = await import('cssnano')

    const opts = { base: src, cwd: src }
    const sourcemaps = preview || process.env.SOURCEMAPS === 'true'
    const postcssPlugins = [
      postcssImport,
      (css, { messages, opts: { file } }) =>
        Promise.all(
          messages
            .reduce((accum, { file: depPath, type }) => {
              return type === 'dependency' ? accum.concat(depPath) : accum
            }, [])
            .map((importedPath) =>
              fs.stat(importedPath).then(({ mtime }) => mtime)
            )
        ).then((mtimes) => {
          const newestMtime = mtimes.reduce(
            (max, curr) => (!max || curr > max ? curr : max),
            file.stat.mtime
          )
          if (newestMtime > file.stat.mtime) {
            file.stat.mtimeMs = +(file.stat.mtime = newestMtime)
          }
        }),
      postcssUrl([
        {
          filter: new RegExp(
            '^src/css/[~][^/]*(?:font|face)[^/]*/.*/files/.+[.](?:ttf|woff2?)$'
          ),
          url: (asset) => {
            const relpath = asset.pathname.substr(1)
            const abspath = require.resolve(relpath)
            const basename = ospath.basename(abspath)
            const destpath = ospath.join(dest, 'font', basename)
            if (!fs.pathExistsSync(destpath)) {
              fs.copySync(abspath, destpath)
            }
            return path.join('..', 'font', basename)
          },
        },
      ]),
      postcssVar({ preserve: preview }),
      // Uncomment the following line if you prefer to import vars.css:
      // postcssVar({ importFrom: ospath.join(src, 'css', 'vars.css'), preserve: preview }),
      preview ? postcssCalc : () => {},
      autoprefixer,
      preview
        ? () => {}
        : (css, result) =>
          cssnanoModule({ preset: 'default' })
            .process(css, { from: undefined })
            .then(() => {
              postcssPseudoElementFixer(css, result)
            }),
    ]

    return merge(
      vfs.src('ui.yml', { ...opts, allowEmpty: true }),
      vfs
        .src('js/+([0-9])-*.js', { ...opts, sourcemaps })
        .pipe(uglify())
        .pipe(concat('js/site.js')),
      vfs
        .src('js/vendor/*([^.])?(.bundle).js', { ...opts, read: false })
        .pipe(
          // Browserify multiple destination example.
          map((file, enc, next) => {
            if (file.relative.endsWith('.bundle.js')) {
              const mtimePromises = []
              const bundlePath = file.path
              browserify(file.relative, { basedir: src, detectGlobals: false })
                .plugin('browser-pack-flat/plugin')
                .on('file', (bundledPath) => {
                  if (bundledPath !== bundlePath) {
                    mtimePromises.push(
                      fs.stat(bundledPath).then(({ mtime }) => mtime)
                    )
                  }
                })
                .bundle((bundleError, bundleBuffer) =>
                  Promise.all(mtimePromises).then((mtimes) => {
                    const newestMtime = mtimes.reduce(
                      (max, curr) => (curr > max ? curr : max),
                      file.stat.mtime
                    )
                    if (newestMtime > file.stat.mtime) {
                      file.stat.mtimeMs = +(file.stat.mtime = newestMtime)
                    }
                    if (bundleBuffer !== undefined) {
                      file.contents = bundleBuffer
                    }
                    file.path =
                      file.path.slice(0, file.path.length - 10) + '.js'
                    next(bundleError, file)
                  })
                )
            } else {
              fs.readFile(file.path, 'UTF-8').then((contents) => {
                file.contents = Buffer.from(contents)
                next(null, file)
              })
            }
          })
        )
        .pipe(buffer())
        .pipe(uglify()),
      vfs
        .src('js/vendor/*.min.js', opts)
        .pipe(
          map((file, enc, next) =>
            next(null, Object.assign(file, { extname: '' }, { extname: '.js' }))
          )
        ),
      // Uncomment and adjust these lines to bundle libraries like jQuery:
      // vfs.src(require.resolve('<package-name-or-require-path>'), opts)
      //   .pipe(concat('js/vendor/<library-name>.js')),
      // vfs.src(require.resolve('jquery/dist/jquery.min.js'), opts)
      //   .pipe(concat('js/vendor/jquery.js')),
      vfs
        .src(['css/site.css', 'css/vendor/*.css'], { ...opts, sourcemaps })
        .pipe(
          postcss((file) => ({ plugins: postcssPlugins, options: { file } }))
        ),
      vfs.src('font/*.{ttf,woff*(2)}', opts),
      vfs
        .src(['img/**/*.{gif,ico,jpg,png,svg}', '!img/book_cover_simple.svg'], opts)
        .pipe(
          preview
            ? through()
            : imagemin([
              gifsicle(),
              jpegtran(),
              optipng(),
              svgo({
                plugins: [
                  {
                    name: 'cleanupIDs',
                    params: {
                      preservePrefixes: ['icon-', 'view-'],
                    },
                  },
                  {
                    name: 'removeViewBox',
                    active: false,
                  },
                  {
                    name: 'removeDesc',
                    active: false,
                  },
                ],
              }),
            ])
        ),
      vfs.src('img/book_cover_simple.svg', opts),
      vfs.src('helpers/*.js', opts),
      vfs.src('layouts/*.hbs', opts),
      vfs.src('partials/*.hbs', opts),
      vfs.src('static/**/*[!~]', {
        ...opts,
        base: ospath.join(src, 'static'),
        dot: true,
      })
    ).pipe(vfs.dest(dest, { sourcemaps: sourcemaps && '.' }))
  }
}

function postcssPseudoElementFixer (css, result) {
  css.walkRules(/(?:^|[^:]):(?:before|after)/, function (rule) {
    rule.selector = rule.selectors
      .map(function (it) {
        return it.replace(/(^|[^:]):(before|after)$/, '$1::$2')
      })
      .join(',')
  })
}
