const fs = require('fs');
const path = require('path');

const WORDS_PER_MINUTE = 250;
const CONTENT_DIR = path.join(__dirname, '../src/app/features/blog/data/content');
const METADATA_FILE = path.join(__dirname, '../src/app/features/blog/data/articles-metadata.data.ts');

/**
 * Count words in a text string
 */
function countWords(text) {
  if (!text) return 0;
  // Remove HTML tags and count words
  const cleanText = text.replace(/<[^>]*>/g, ' ');
  const words = cleanText.trim().split(/\s+/);
  return words.filter(word => word.length > 0).length;
}

/**
 * Count words in content blocks
 */
function countWordsInContent(content) {
  if (!Array.isArray(content)) return 0;

  let totalWords = 0;

  for (const block of content) {
    switch (block.type) {
      case 'paragraph':
        totalWords += countWords(block.data?.text || '');
        break;

      case 'heading':
        totalWords += countWords(block.data?.text || '');
        break;

      case 'list':
        if (Array.isArray(block.data?.items)) {
          for (const item of block.data.items) {
            totalWords += countWords(item);
          }
        }
        break;

      case 'blockquote':
        totalWords += countWords(block.data?.text || '');
        totalWords += countWords(block.data?.caption || '');
        break;

      case 'code':
        // Count code comments but not code itself
        totalWords += countWords(block.data?.caption || '');
        break;

      case 'image':
      case 'gallery':
      case 'moviePoster':
        totalWords += countWords(block.data?.caption || '');
        break;

      case 'cta':
        totalWords += countWords(block.data?.title || '');
        totalWords += countWords(block.data?.description || '');
        totalWords += countWords(block.data?.buttonText || '');
        break;

      case 'component':
        totalWords += countWords(block.data?.title || '');
        totalWords += countWords(block.data?.content || '');
        totalWords += countWords(block.data?.message || '');
        break;

      case 'video':
      case 'audio':
        totalWords += countWords(block.data?.title || '');
        totalWords += countWords(block.data?.description || '');
        break;
    }
  }

  return totalWords;
}

/**
 * Calculate read time in minutes
 */
function calculateReadTime(wordCount) {
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

/**
 * Get all content files
 */
function getContentFiles() {
  if (!fs.existsSync(CONTENT_DIR)) {
    console.log('No content directory found — skipping read time calculation.');
    return [];
  }
  const files = fs.readdirSync(CONTENT_DIR);
  return files.filter(file => file.endsWith('.content.ts') && file !== 'article-content-loader.ts');
}

/**
 * Extract content from a TypeScript content file
 */
function extractContentFromFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  let wordCount = 0;

  // Extract all text content using more flexible patterns
  // This handles single quotes, double quotes, backticks, and multiline strings

  // Pattern for text: 'some text' or text: "some text" or text: `some text`
  const textPattern = /text:\s*(['"`])((?:(?!\1)[^\\]|\\.)*)(\1)/gs;
  let match;

  while ((match = textPattern.exec(fileContent)) !== null) {
    const text = match[2];
    // Unescape the text
    const unescaped = text.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\`/g, '`').replace(/\\\\/g, '\\');
    wordCount += countWords(unescaped);
  }

  // Pattern for caption text
  const captionPattern = /caption:\s*(['"`])((?:(?!\1)[^\\]|\\.)*)(\1)/gs;
  while ((match = captionPattern.exec(fileContent)) !== null) {
    const text = match[2];
    const unescaped = text.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\`/g, '`').replace(/\\\\/g, '\\');
    wordCount += countWords(unescaped);
  }

  // Pattern for title text
  const titlePattern = /title:\s*(['"`])((?:(?!\1)[^\\]|\\.)*)(\1)/gs;
  while ((match = titlePattern.exec(fileContent)) !== null) {
    const text = match[2];
    const unescaped = text.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\`/g, '`').replace(/\\\\/g, '\\');
    wordCount += countWords(unescaped);
  }

  // Pattern for description text
  const descriptionPattern = /description:\s*(['"`])((?:(?!\1)[^\\]|\\.)*)(\1)/gs;
  while ((match = descriptionPattern.exec(fileContent)) !== null) {
    const text = match[2];
    const unescaped = text.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\`/g, '`').replace(/\\\\/g, '\\');
    wordCount += countWords(unescaped);
  }

  // Pattern for content text (alert components, etc.)
  const contentPattern = /\bcontent:\s*(['"`])((?:(?!\1)[^\\]|\\.)*)(\1)/gs;
  while ((match = contentPattern.exec(fileContent)) !== null) {
    const text = match[2];
    const unescaped = text.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\`/g, '`').replace(/\\\\/g, '\\');
    wordCount += countWords(unescaped);
  }

  // Pattern for message text (alert components)
  const messagePattern = /message:\s*(['"`])((?:(?!\1)[^\\]|\\.)*)(\1)/gs;
  while ((match = messagePattern.exec(fileContent)) !== null) {
    const text = match[2];
    const unescaped = text.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\`/g, '`').replace(/\\\\/g, '\\');
    wordCount += countWords(unescaped);
  }

  return wordCount > 0 ? wordCount : null;
}

/**
 * Map file names to article slugs
 */
function getSlugFromFileName(fileName) {
  // Remove .content.ts extension
  let slug = fileName.replace('.content.ts', '');

  // Special cases where file name doesn't match slug
  const specialCases = {
    'how-to-use-the-base-number-converter-tool': 'base-number-converter-tutorial',
    'the-top-ten-best-and-worst-movie-remakes': 'the-top-ten-worst-movie-remakes',
    'it-happened-again-pensacola-wakes-up-to-snow-for-the-second-january-in-a-row': 'pensacola-snow-second-year',
  };

  return specialCases[slug] || slug;
}

/**
 * Find matching closing brace for an opening brace
 */
function findMatchingBrace(text, startIndex) {
  let braceCount = 0;
  for (let i = startIndex; i < text.length; i++) {
    if (text[i] === '{') braceCount++;
    if (text[i] === '}') {
      braceCount--;
      if (braceCount === 0) return i;
    }
  }
  return -1;
}

/**
 * Update metadata file with read times
 */
function updateMetadataFile(readTimes) {
  let metadataContent = fs.readFileSync(METADATA_FILE, 'utf-8');

  // For each article, add or update the readTime field
  for (const [slug, readTime] of Object.entries(readTimes)) {
    // Find the article entry by slug
    const slugPattern = new RegExp(`slug:\\s*['"\`]${slug}['"\`]`, 'g');
    const slugMatch = slugPattern.exec(metadataContent);

    if (!slugMatch) {
      console.warn(`Could not find slug "${slug}" in metadata file`);
      continue;
    }

    // Find the start of this article object (search backwards for opening brace)
    let objectStart = slugMatch.index;
    while (objectStart > 0 && metadataContent[objectStart] !== '{') {
      objectStart--;
    }

    // Find the matching closing brace
    const objectEnd = findMatchingBrace(metadataContent, objectStart);
    if (objectEnd === -1) {
      console.warn(`Could not find closing brace for article "${slug}"`);
      continue;
    }

    // Extract the article object
    const articleObject = metadataContent.substring(objectStart, objectEnd + 1);

    // Check if readTime already exists
    if (/readTime:\s*\d+/.test(articleObject)) {
      // Update existing readTime
      const updatedObject = articleObject.replace(/readTime:\s*\d+/, `readTime: ${readTime}`);
      metadataContent = metadataContent.substring(0, objectStart) + updatedObject + metadataContent.substring(objectEnd + 1);
    } else {
      // Add readTime before the closing brace
      // Find the last line before the closing brace to get proper indentation
      const lines = articleObject.split('\n');
      const lastLine = lines[lines.length - 2] || lines[lines.length - 1]; // Second to last line (last is just the closing brace)
      const indent = lastLine.match(/^\s*/)[0];

      // Insert readTime before the closing brace (no leading comma since previous property already has one)
      const insertPosition = objectEnd;
      const newLine = `${indent}readTime: ${readTime},\n${indent.substring(0, indent.length - 2)}`;
      metadataContent = metadataContent.substring(0, insertPosition) + newLine + metadataContent.substring(insertPosition);
    }
  }

  fs.writeFileSync(METADATA_FILE, metadataContent, 'utf-8');
}

/**
 * Main function
 */
function main() {
  console.log('Calculating read times for all blog articles...\n');

  const contentFiles = getContentFiles();
  const readTimes = {};

  for (const file of contentFiles) {
    const filePath = path.join(CONTENT_DIR, file);
    const slug = getSlugFromFileName(file);

    const wordCount = extractContentFromFile(filePath);

    if (wordCount === null) {
      console.log(`⚠️  ${file}: Could not parse content`);
      continue;
    }

    const readTime = calculateReadTime(wordCount);
    readTimes[slug] = readTime;

    console.log(`✓ ${slug}: ${wordCount} words → ${readTime} min`);
  }

  if (Object.keys(readTimes).length === 0) {
    console.log('No articles to update.');
    return;
  }

  if (!fs.existsSync(METADATA_FILE)) {
    console.log('No metadata file found — skipping metadata update.');
    return;
  }

  console.log(`\nUpdating ${Object.keys(readTimes).length} articles in metadata file...`);
  updateMetadataFile(readTimes);
  console.log('✓ Metadata file updated successfully!');
}

main();
