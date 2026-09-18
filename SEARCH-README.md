# Lunr.js Search

This UI bundle contains the Lunr browser client and the search result styling. Each documentation repository is responsible for generating its own index during the Antora build.

## Configure a Documentation Repository

Install `@feelpp/antora-extensions`, then register only its Lunr extension in `site.yml`:

```yaml
site:
  url: https://example.org/project/

antora:
  extensions:
    - require: '@feelpp/antora-extensions/src/lunr.js'
      lunr:
        indexFile: search-index.json
        maxContentLength: 1000
        minContentLength: 50
```

Run the normal Antora build. The extension generates `search-index.json` in the output directory after Antora publishes the site.

`site.url` must be the public deployment URL. Its pathname is used for the index request and every result URL. A site at `https://example.org/project/` therefore loads `/project/search-index.json` and returns links below `/project/`.

## Options

The `lunr` mapping accepts:

- `indexFile`: output filename; default `search-index.json`.
- `maxContentLength`: maximum characters indexed from each page; default `1000`.
- `minContentLength`: minimum characters for a page to be indexed; default `50`.
- `debug`: enable extraction diagnostics.

The generator skips `404.html`. The browser client waits for at least two query characters and displays up to ten matching results.

## Algolia

When the generated UI contains an Algolia DocSearch API key, the UI uses DocSearch and does not initialize Lunr.

## Verification

Add a repository-specific build check that parses the generated `search-index.json`, requires non-empty documents, and verifies that every document URL starts with the pathname from `site.url`.
