const fs = require('fs');
const path = require('path');

const siteUrl = (process.env.SITE_URL || 'https://www.allthethings.dev').replace(/\/+$/, '');
const maxItems = Number(process.env.RSS_MAX_ITEMS || 50);

const defaultChannelTitle = 'All The Things - Your Swiss Army Knife of Web Utilities';
const defaultChannelDescription = 'Free online tools for text, images, developers, and more. Word counter, case converter, JSON formatter, and 20+ other utilities.';

function readFileSafe(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/\'/g, '&apos;');
}

function toTitleCase(value) {
  return value
    .split(/[-_]/g)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function parseDateFromYmd(value) {
  if (!value) return null;
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const [, year, month, day] = match;
  return new Date(`${year}-${month}-${day}T00:00:00Z`);
}

function parseDateFromMdY(value) {
  if (!value) return null;
  const match = value.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!match) return null;
  const [, month, day, year] = match;
  return new Date(`${year}-${month}-${day}T00:00:00Z`);
}

function findProjectName() {
  const angularConfig = JSON.parse(readFileSafe(path.join(process.cwd(), 'angular.json')));
  const projectNames = Object.keys(angularConfig.projects || {});
  return projectNames[0];
}

function findSitemapPath() {
  const projectName = findProjectName();
  const preferred = path.join(process.cwd(), 'dist', projectName, 'browser', 'sitemap.xml');
  if (fs.existsSync(preferred)) {
    return preferred;
  }
  const distRoot = path.join(process.cwd(), 'dist');
  if (!fs.existsSync(distRoot)) {
    throw new Error('dist directory not found');
  }
  const candidates = fs.readdirSync(distRoot, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => path.join(distRoot, entry.name, 'browser', 'sitemap.xml'))
    .filter(candidate => fs.existsSync(candidate));
  if (candidates.length === 0) {
    throw new Error('sitemap.xml not found in dist');
  }
  return candidates[0];
}

function extractArrayText(source, exportName) {
  const exportIndex = source.indexOf(exportName);
  if (exportIndex === -1) return '';
  const arrayStart = source.indexOf('[', exportIndex);
  if (arrayStart === -1) return '';
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = arrayStart; i < source.length; i += 1) {
    const ch = source[i];
    if (inString) {
      if (escape) {
        escape = false;
      } else if (ch === '\\') {
        escape = true;
      } else if (ch === '\'') {
        inString = false;
      }
    } else {
      if (ch === '\'') {
        inString = true;
      } else if (ch === '[') {
        depth += 1;
      } else if (ch === ']') {
        depth -= 1;
        if (depth === 0) {
          return source.slice(arrayStart + 1, i);
        }
      }
    }
  }
  return '';
}

function splitObjects(arrayText) {
  const objects = [];
  let depth = 0;
  let inString = false;
  let escape = false;
  let start = -1;
  for (let i = 0; i < arrayText.length; i += 1) {
    const ch = arrayText[i];
    if (inString) {
      if (escape) {
        escape = false;
      } else if (ch === '\\') {
        escape = true;
      } else if (ch === '\'') {
        inString = false;
      }
    } else {
      if (ch === '\'') {
        inString = true;
      } else if (ch === '{') {
        if (depth === 0) start = i;
        depth += 1;
      } else if (ch === '}') {
        depth -= 1;
        if (depth === 0 && start !== -1) {
          objects.push(arrayText.slice(start, i + 1));
          start = -1;
        }
      }
    }
  }
  return objects;
}

function readSingleQuotedField(text, field) {
  const fieldIndex = text.indexOf(`${field}:`);
  if (fieldIndex === -1) return '';
  let i = text.indexOf('\'', fieldIndex);
  if (i === -1) return '';
  i += 1;
  let value = '';
  let escape = false;
  for (; i < text.length; i += 1) {
    const ch = text[i];
    if (escape) {
      value += ch;
      escape = false;
    } else if (ch === '\\') {
      escape = true;
    } else if (ch === '\'') {
      return value;
    } else {
      value += ch;
    }
  }
  return value;
}

async function loadBlogMetadata() {
  const map = new Map();
  try {
    const indexRes = await fetch('https://json.allthethings.dev/blog/blog.json');
    if (!indexRes.ok) return map;
    const indexData = await indexRes.json();
    const slugs = (indexData.articles || []).map(a => a.id).filter(Boolean);
    await Promise.all(slugs.map(async slug => {
      try {
        const previewRes = await fetch(`https://json.allthethings.dev/blog/previews/${slug}.json`);
        if (!previewRes.ok) return;
        const preview = await previewRes.json();
        map.set(slug, {
          title: preview.title || '',
          description: preview.description || '',
          metaDescription: preview.metaDescription || preview.description || '',
          publishedDate: preview.publishedDate || ''
        });
      } catch {
        // skip individual preview failures
      }
    }));
  } catch {
    // return empty map if fetch fails
  }
  return map;
}

function loadToolsMetadata() {
  const filePath = path.join(process.cwd(), 'src', 'app', 'core', 'services', 'tools.service.ts');
  const source = readFileSafe(filePath);
  const arrayText = extractArrayText(source, 'private tools');
  const entries = splitObjects(arrayText);
  const map = new Map();
  entries.forEach(entry => {
    const route = readSingleQuotedField(entry, 'route');
    if (!route) return;
    map.set(route, {
      name: readSingleQuotedField(entry, 'name'),
      description: readSingleQuotedField(entry, 'description'),
      longDescription: readSingleQuotedField(entry, 'longDescription')
    });
  });
  return map;
}

function parseSitemap(sitemapPath) {
  const xml = readFileSafe(sitemapPath);
  const matches = Array.from(xml.matchAll(/<url>([\s\S]*?)<\/url>/g));
  return matches.map(match => {
    const block = match[1];
    const locMatch = block.match(/<loc>([^<]+)<\/loc>/);
    const lastmodMatch = block.match(/<lastmod>([^<]+)<\/lastmod>/);
    return {
      loc: locMatch ? locMatch[1].trim() : '',
      lastmod: lastmodMatch ? lastmodMatch[1].trim() : ''
    };
  }).filter(entry => entry.loc);
}

function buildAbsoluteUrl(loc) {
  const url = new URL(loc);
  const pathPart = `${url.pathname}${url.search}${url.hash}`;
  return `${siteUrl}${pathPart}`.replace(/\/+$/, '') || siteUrl;
}

function buildItems(urlEntries, blogMeta, toolsMeta) {
  return urlEntries.map(entry => {
    const absolute = buildAbsoluteUrl(entry.loc);
    const pathname = new URL(absolute).pathname;
    const segments = pathname.split('/').filter(Boolean);
    const lastmodDate = parseDateFromYmd(entry.lastmod);
    let title = '';
    let description = '';
    let pubDate = lastmodDate;

    if (pathname.startsWith('/blog/') && segments[1]) {
      const slug = segments[1];
      const meta = blogMeta.get(slug);
      if (meta) {
        title = meta.title || toTitleCase(slug);
        description = meta.description || meta.metaDescription || '';
        const blogDate = parseDateFromMdY(meta.publishedDate);
        if (blogDate) pubDate = blogDate;
      }
    } else if (pathname.startsWith('/tools/') && segments[1]) {
      const route = segments.slice(1).join('/');
      const meta = toolsMeta.get(route);
      if (meta) {
        title = meta.name || toTitleCase(segments[1]);
        description = meta.description || meta.longDescription || '';
      }
    }

    if (!title) {
      title = pathname === '/' ? 'Home' : toTitleCase(segments[segments.length - 1] || 'Home');
    }

    if (!description) {
      description = `All The Things - ${title}`;
    }

    return {
      title,
      link: absolute,
      guid: absolute,
      pubDate: pubDate || new Date(0),
      description
    };
  });
}

function buildRss(items) {
  const sortedItems = items
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
    .slice(0, maxItems);

  const latestDate = sortedItems.reduce((max, item) => {
    const time = item.pubDate.getTime();
    return time > max ? time : max;
  }, 0);

  const lastBuildDate = new Date(latestDate || 0).toUTCString();

  const itemXml = sortedItems.map(item => {
    return [
      '    <item>',
      `      <title>${xmlEscape(item.title)}</title>`,
      `      <link>${xmlEscape(item.link)}</link>`,
      `      <guid>${xmlEscape(item.guid)}</guid>`,
      `      <pubDate>${item.pubDate.toUTCString()}</pubDate>`,
      `      <description>${xmlEscape(item.description)}</description>`,
      '    </item>'
    ].join('\n');
  }).join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '  <channel>',
    `    <title>${xmlEscape(defaultChannelTitle)}</title>`,
    `    <link>${xmlEscape(siteUrl)}</link>`,
    `    <description>${xmlEscape(defaultChannelDescription)}</description>`,
    `    <lastBuildDate>${lastBuildDate}</lastBuildDate>`,
    itemXml,
    '  </channel>',
    '</rss>',
    ''
  ].join('\n');
}

async function main() {
  const sitemapPath = findSitemapPath();
  const distBrowserDir = path.dirname(sitemapPath);
  const urlEntries = parseSitemap(sitemapPath);
  const blogMeta = await loadBlogMetadata();
  const toolsMeta = loadToolsMetadata();
  const items = buildItems(urlEntries, blogMeta, toolsMeta);
  const rssXml = buildRss(items);
  fs.writeFileSync(path.join(distBrowserDir, 'rss.xml'), rssXml, 'utf8');
  fs.writeFileSync(path.join(distBrowserDir, 'feed.xml'), rssXml, 'utf8');
}

main();
