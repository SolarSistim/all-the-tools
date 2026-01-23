import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import * as cheerio from 'cheerio';

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
