#!/usr/bin/env node

/**
 * Generate Lunr.js search index for Antora documentation
 * 
 * This script crawls the generated Antora site and creates a search index
 * that can be used by the Lunr.js client-side search.
 * 
 * Usage:
 *   node generate-search-index.js [site-directory] [output-file]
 * 
 * Example:
 *   node generate-search-index.js ./build/site ./build/site/search-index.json
 */

const fs = require('fs')
const path = require('path')
const { JSDOM } = require('jsdom')

// Default configuration
const DEFAULT_SITE_DIR = './build/site'
const DEFAULT_OUTPUT_FILE = './build/site/search-index.json'

function extractTextContent(html) {
  try {
    const dom = new JSDOM(html)
    const document = dom.window.document
    
    // Remove script and style elements
    const scripts = document.querySelectorAll('script, style, nav, .navbar, .footer')
    scripts.forEach(el => el.remove())
    
    // Get main content area
    const main = document.querySelector('main, .main, .content, article')
    const content = main || document.body
    
    return content.textContent.trim().replace(/\s+/g, ' ')
  } catch (error) {
    console.warn('Failed to parse HTML:', error.message)
    return ''
  }
}

function getTitle(html) {
  try {
    const dom = new JSDOM(html)
    const titleEl = dom.window.document.querySelector('title, h1, .page-title')
    return titleEl ? titleEl.textContent.trim() : 'Untitled'
  } catch (error) {
    return 'Untitled'
  }
}

function walkDirectory(dir, fileList = []) {
  const files = fs.readdirSync(dir)
  
  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory()) {
      walkDirectory(filePath, fileList)
    } else if (file.endsWith('.html')) {
      fileList.push(filePath)
    }
  })
  
  return fileList
}

function generateSearchIndex(siteDir, outputFile) {
  console.log(`Generating search index from: ${siteDir}`)
  
  if (!fs.existsSync(siteDir)) {
    console.error(`Site directory does not exist: ${siteDir}`)
    process.exit(1)
  }
  
  const htmlFiles = walkDirectory(siteDir)
  const documents = []
  let id = 0
  
  htmlFiles.forEach(filePath => {
    try {
      const html = fs.readFileSync(filePath, 'utf8')
      const title = getTitle(html)
      const content = extractTextContent(html)
      
      // Skip empty content
      if (!content || content.length < 50) {
        return
      }
      
      // Generate relative URL
      const relativePath = path.relative(siteDir, filePath)
      const url = '/' + relativePath.replace(/\\/g, '/').replace(/\/index\.html$/, '/')
      
      documents.push({
        id: ++id,
        title: title,
        content: content.substring(0, 1000), // Limit content length
        url: url
      })
      
      console.log(`Indexed: ${title} (${url})`)
    } catch (error) {
      console.warn(`Failed to process ${filePath}:`, error.message)
    }
  })
  
  const searchIndex = {
    documents: documents
  }
  
  // Ensure output directory exists
  const outputDir = path.dirname(outputFile)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }
  
  // Write search index
  fs.writeFileSync(outputFile, JSON.stringify(searchIndex, null, 2))
  console.log(`\nSearch index generated successfully!`)
  console.log(`- Indexed ${documents.length} documents`)
  console.log(`- Output file: ${outputFile}`)
  console.log(`- File size: ${(fs.statSync(outputFile).size / 1024).toFixed(2)} KB`)
}

// Command line interface
if (require.main === module) {
  const siteDir = process.argv[2] || DEFAULT_SITE_DIR
  const outputFile = process.argv[3] || DEFAULT_OUTPUT_FILE
  
  try {
    generateSearchIndex(siteDir, outputFile)
  } catch (error) {
    console.error('Error generating search index:', error.message)
    process.exit(1)
  }
}

module.exports = { generateSearchIndex }