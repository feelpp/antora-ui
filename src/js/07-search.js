;(function () {
  'use strict'

  /* global fetch, lunr */

  var searchInput
  var searchResults
  var searchIndex
  var documents

  function init () {
    searchInput = document.getElementById('search-query')
    if (!searchInput) return

    // Check if Algolia DocSearch is already configured
    var docSearchScript = document.getElementById('search-script')
    if (docSearchScript && docSearchScript.dataset.apiKey) {
      console.log('Algolia DocSearch detected, skipping Lunr.js initialization')
      return
    }

    // Only initialize Lunr.js if DocSearch is not configured
    console.log('Initializing Lunr.js client-side search')

    // Create search results container
    createSearchResultsContainer()

    // Load search index
    loadSearchIndex()

    // Add event listeners
    searchInput.addEventListener('input', handleSearch)
    searchInput.addEventListener('focus', function () {
      if (searchResults && searchInput.value.trim()) {
        searchResults.style.display = 'block'
      }
    })

    // Hide results when clicking outside
    document.addEventListener('click', function (e) {
      if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.style.display = 'none'
      }
    })
  }

  function createSearchResultsContainer () {
    var searchContainer = searchInput.closest('.search')
    searchResults = document.createElement('div')
    searchResults.className = 'search-results'
    searchResults.style.display = 'none'
    searchContainer.appendChild(searchResults)
  }

  function loadSearchIndex () {
    // Try to load the search index
    if (typeof fetch === 'undefined') {
      console.warn('Fetch API not supported. Search functionality will be limited.')
      return
    }

    // Try both site root and UI root paths for the search index
    var searchIndexPaths = [
      '/search-index.json', // Site root (most likely location)
      window.uiRootPath + '/search-index.json', // UI root path
      './search-index.json', // Relative to current page
    ]

    function tryLoadIndex (pathIndex) {
      if (pathIndex >= searchIndexPaths.length) {
        console.warn('Search index not found in any expected location. Search functionality will be limited.')
        showNoIndexMessage()
        return
      }

      var indexPath = searchIndexPaths[pathIndex]
      console.log('Trying to load search index from:', indexPath)

      fetch(indexPath)
        .then(function (response) {
          if (!response.ok) {
            console.warn(`Search index not found at ${indexPath}, trying next location...`)
            tryLoadIndex(pathIndex + 1)
            return null
          }
          console.log('Search index found at:', indexPath)
          return response.json()
        })
        .then(function (data) {
          if (data) {
            if (typeof lunr !== 'undefined') {
              documents = data.documents
              searchIndex = lunr(function () {
                this.ref('id')
                this.field('title', { boost: 10 })
                this.field('content')
                this.field('url')

                data.documents.forEach(function (doc) {
                  this.add(doc)
                }, this)
              })
              console.log('Search index loaded successfully with', data.documents.length, 'documents')
            } else {
              console.error('Lunr.js is not available!')
              showNoIndexMessage()
            }
          }
        })
        .catch(function (error) {
          console.warn(`Failed to load search index from ${indexPath}:`, error)
          tryLoadIndex(pathIndex + 1)
        })
    }

    tryLoadIndex(0)
  }

  function handleSearch (e) {
    var query = e.target.value.trim()

    if (query.length < 2) {
      searchResults.style.display = 'none'
      return
    }

    if (!searchIndex) {
      showNoIndexMessage()
      return
    }

    try {
      var results = searchIndex.search(query + '*') // Add wildcard for partial matching
      displayResults(results, query)
    } catch (error) {
      console.warn('Search error:', error)
      displayResults([], query)
    }
  }

  function showNoIndexMessage () {
    searchResults.innerHTML = '<div class="search-no-index">Search index not available</div>'
    searchResults.style.display = 'block'
  }

  function displayResults (results, query) {
    if (results.length === 0) {
      var noResultsMsg = 'No results found for "' + escapeHtml(query) + '"'
      searchResults.innerHTML = '<div class="search-no-results">' + noResultsMsg + '</div>'
    } else {
      var resultCount = results.length
      var plural = resultCount !== 1 ? 's' : ''
      var html = '<div class="search-results-header">Found ' + resultCount + ' result' + plural + '</div>'

      results.slice(0, 10).forEach(function (result) {
        // Try both exact match and type conversion
        var doc = documents.find(function (d) {
          return d.id === result.ref || d.id === parseInt(result.ref) || d.id === String(result.ref)
        })
        if (doc) {
          html += '<div class="search-result-item">'
          html += '<h4><a href="' + escapeHtml(doc.url) + '">' + escapeHtml(doc.title) + '</a></h4>'
          html += '<p>' + escapeHtml(truncateContent(doc.content, 150)) + '</p>'
          html += '<div class="search-result-url">' + escapeHtml(doc.url) + '</div>'
          html += '</div>'
        }
      })

      searchResults.innerHTML = html
    }

    searchResults.style.display = 'block'
  }

  function truncateContent (content, maxLength) {
    if (content.length <= maxLength) return content
    return content.substr(0, maxLength) + '...'
  }

  function escapeHtml (text) {
    var div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()
