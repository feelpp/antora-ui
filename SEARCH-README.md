# Lunr.js Search Implementation

This Antora UI now includes client-side search functionality using Lunr.js instead of Algolia DocSearch.

## Features

- **Client-side search**: No external dependencies or API keys required
- **Fast and responsive**: Search results appear as you type
- **Lightweight**: Only includes what you need
- **Easy to implement**: Simple setup process

## How It Works

1. **Search Index Generation**: A script crawls your built site and creates a JSON search index
2. **Client-side Search**: Lunr.js loads the index and provides instant search results
3. **Clean UI**: Modern dropdown interface with styled search results

## Setup Instructions

### 1. Build Your Site
First, build your Antora site as usual:

```bash
npm run antora
```

### 2. Generate Search Index
After building your site, generate the search index:

```bash
npm run generate-search-index
```

This will create a `search-index.json` file in your site's root directory.

### 3. Deploy
Deploy your site with the generated search index. The search functionality will work automatically.

## Manual Index Generation

You can also generate the search index manually:

```bash
node tasks/generate-search-index.js [site-directory] [output-file]
```

Examples:
```bash
# Use defaults (./build/site and ./build/site/search-index.json)
node tasks/generate-search-index.js

# Custom directories
node tasks/generate-search-index.js ./public ./public/search-index.json
```

## Integration in CI/CD

Add the search index generation to your build process:

```yaml
# Example GitHub Actions step
- name: Generate search index
  run: |
    npm run antora
    npm run generate-search-index
```

## Customization

### Search Behavior
Modify `src/js/07-search.js` to customize:
- Search result display
- Number of results shown
- Search field behavior

### Search Styling
Modify `src/css/lunr-search.css` to customize:
- Search results appearance
- Dropdown positioning
- Mobile responsiveness

### Index Content
Modify `tasks/generate-search-index.js` to customize:
- Which content to index
- Content processing
- Index structure

## Performance Notes

- **Index Size**: Aim for < 500KB for good performance
- **Content Limits**: Content is truncated to 1000 characters per page
- **Browser Support**: Works in all modern browsers with ES5 support

## Troubleshooting

### Search Not Working
1. Check browser console for JavaScript errors
2. Verify `search-index.json` is accessible at your site root
3. Ensure Lunr.js is loaded before your search script

### Empty Search Results
1. Regenerate the search index
2. Check that your HTML content is being parsed correctly
3. Verify the index file contains documents

### Poor Search Quality
1. Adjust content extraction in the generator script
2. Modify Lunr.js field boosting (title vs content)
3. Customize search query processing

## Migration from DocSearch

The Lunr.js implementation replaces Algolia DocSearch with these advantages:

- ✅ No external API dependencies
- ✅ No registration or approval required
- ✅ Works offline
- ✅ No tracking or analytics
- ✅ Complete control over search behavior

- ❌ No typo tolerance (can be added)
- ❌ Limited to smaller sites (< 10MB of content)
- ❌ No advanced analytics