import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import * as cheerio from 'cheerio';
const { google } = require('googleapis');

interface OGData {
  title: string;
  description: string;
  image: string;
  imageDimensions?: { width: number; height: number };
  siteName?: string;
  type?: string;
  url: string;
}

interface RateLimitState {
  count: number;
  windowStart: number;
  throttledCount: number;
}

// In-memory rate limiter (resets on cold start)
let rateLimitState: RateLimitState = {
  count: 0,
  windowStart: Date.now(),
  throttledCount: 0
};

const RATE_LIMIT = 10;
const TIMEOUT_MS = parseInt(process.env.OG_SCRAPE_TIMEOUT_MS || '5000', 10);
const WINDOW_MS = 60000; // 60 seconds

function checkRateLimit(): { allowed: boolean; remaining: number; resetTime: number; queuePosition: number } {
  const now = Date.now();
  const windowElapsed = now - rateLimitState.windowStart;

  // Reset window if expired
  if (windowElapsed >= WINDOW_MS) {
    rateLimitState = {
      count: 0,
      windowStart: now,
      throttledCount: 0
    };
  }

  const allowed = rateLimitState.count < RATE_LIMIT;
  const remaining = Math.max(0, RATE_LIMIT - rateLimitState.count);
  const resetTime = Math.ceil((WINDOW_MS - windowElapsed) / 1000);

  if (allowed) {
    rateLimitState.count++;
  } else {
    rateLimitState.throttledCount++;
  }

  return { allowed, remaining, resetTime, queuePosition: rateLimitState.throttledCount };
}

function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

async function fetchWithTimeout(url: string, timeout: number): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; OGScraper/1.0; +https://www.allthethings.dev/)'
      }
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

function extractOGData(html: string, url: string): OGData {
  const $ = cheerio.load(html);

  // Extract OG tags
  const title = $('meta[property="og:title"]').attr('content') || $('title').text() || '';
  const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || '';
  const image = $('meta[property="og:image"]').attr('content') || '';
  const imageWidth = parseInt($('meta[property="og:image:width"]').attr('content') || '0', 10);
  const imageHeight = parseInt($('meta[property="og:image:height"]').attr('content') || '0', 10);
  const siteName = $('meta[property="og:site_name"]').attr('content') || '';
  const type = $('meta[property="og:type"]').attr('content') || '';

  const ogData: OGData = {
    title: title.trim(),
    description: description.trim(),
    image: image.trim(),
    url: url
  };

  if (imageWidth > 0 && imageHeight > 0) {
    ogData.imageDimensions = { width: imageWidth, height: imageHeight };
  }

  if (siteName) {
    ogData.siteName = siteName.trim();
  }

  if (type) {
    ogData.type = type.trim();
  }

  return ogData;
}

/**
 * Log the fetch event to Google Sheets
 */
async function logFetchEvent(event: HandlerEvent, url: string) {
  try {
    // Decode Netlify geo data from x-nf-geo header (base64 encoded JSON)
    let geoData: any = null;
    if (event.headers['x-nf-geo']) {
      try {
        const decoded = Buffer.from(event.headers['x-nf-geo'], 'base64').toString('utf-8');
        geoData = JSON.parse(decoded);
      } catch (error) {
        console.error('Error decoding geo data:', error);
      }
    }

    const params = event.queryStringParameters || {};

    // Extract metadata from headers and query parameters
    const logInfo = {
      humanReadableDate: new Date().toLocaleString('en-US', {
        timeZone: 'America/Chicago',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }),
      referrer: params.referrer || 'Direct',
      urlPath: url,
      ip: event.headers['cf-connecting-ip'] ||
        event.headers['x-nf-client-connection-ip'] ||
        event.headers['client-ip'] ||
        'Unknown',
      country: geoData?.country?.code || event.headers['x-country'] || 'Unknown',
      city: geoData?.city || 'Unknown',
      region: geoData?.subdivision?.code || 'Unknown',
      coordinates: geoData ? `${geoData.latitude}, ${geoData.longitude}` : 'Unknown',
      sessionId: params.sessionId || '',
      deviceType: params.deviceType || 'Unknown',
      userAgent: params.userAgent || event.headers['user-agent'] || 'Unknown',
      screenResolution: params.screenResolution || 'Unknown',
      language: params.language || 'Unknown',
    };

    // Initialize Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1NDJC3E6n9rGkILd0IKI58vksBSW9eAJQ9gDTzBzoWbs';
    const sheetName = 'meta_fetch_function';
    const range = `${sheetName}!A:M`;

    // Prepare the row data matching the headers:
    // Date, Referrer URL, URL Path, IP Address, Country, City, Region, Coordinates, Session ID, Device Type, User Agent, Screen Resolution, Language
    const values = [[
      logInfo.humanReadableDate,
      logInfo.referrer,
      logInfo.urlPath,
      logInfo.ip,
      logInfo.country,
      logInfo.city,
      logInfo.region,
      logInfo.coordinates,
      logInfo.sessionId,
      logInfo.deviceType,
      logInfo.userAgent,
      logInfo.screenResolution,
      logInfo.language,
    ]];

    // Append the data to the sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: {
        values,
      },
    });

    console.log('Fetch event logged to Google Sheets');
  } catch (error) {
    console.error('Error logging fetch event:', error);
  }
}

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS request for CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, error: 'Method not allowed' })
    };
  }

  // Check rate limit
  const rateLimit = checkRateLimit();
  if (!rateLimit.allowed) {
    return {
      statusCode: 429,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Rate limit exceeded. Please try again later.',
        retryAfter: rateLimit.resetTime,
        queuePosition: rateLimit.queuePosition
      })
    };
  }

  // Get URL from query parameters
  const url = event.queryStringParameters?.url;

  if (!url) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ success: false, error: 'URL parameter is required' })
    };
  }

  // Validate URL
  if (!isValidUrl(url)) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ success: false, error: 'Invalid URL format' })
    };
  }

  // Log the fetch event (fire and forget - but we await it for simplicity in this serverless environment)
  // We do this before fetching to capture the attempt
  await logFetchEvent(event, url);

  try {
    // Fetch the URL
    const response = await fetchWithTimeout(url, TIMEOUT_MS);

    if (!response.ok) {
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({
          success: false,
          error: `Failed to fetch URL: ${response.status} ${response.statusText}`
        })
      };
    }

    // Get HTML content
    const html = await response.text();

    // Extract OG data
    const ogData = extractOGData(html, url);

    // Return success response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: ogData,
        rateLimit: {
          remaining: rateLimit.remaining - 1,
          resetTime: rateLimit.resetTime
        }
      })
    };

  } catch (error: any) {
    console.error('Error fetching OG data:', error);

    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Unable to fetch URL. Please check the URL and try again.'
      })
    };
  }
};
