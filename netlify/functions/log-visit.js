// Netlify Function: log-visit
// This function logs visitor information to Google Sheets

const { google } = require('googleapis');

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse the request body
    const data = JSON.parse(event.body);

    // Decode Netlify geo data from x-nf-geo header (base64 encoded JSON)
    let geoData = null;
    if (event.headers['x-nf-geo']) {
      try {
        const decoded = Buffer.from(event.headers['x-nf-geo'], 'base64').toString('utf-8');
        geoData = JSON.parse(decoded);
      } catch (error) {
        console.error('Error decoding geo data:', error);
      }
    }

    // Extract domain from headers
    const domain = event.headers['host'] ||
                   event.headers['x-forwarded-host'] ||
                   data.domain ||
                   'Unknown';

    // Extract visitor information
    const visitorInfo = {
      timestamp: new Date().toISOString(),
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
      domain: domain,
      referrer: data.referrer || 'Direct',
      urlPath: data.urlPath || '/',
      sessionId: data.sessionId || '',
      deviceType: data.deviceType || 'Unknown',
      userAgent: data.userAgent || event.headers['user-agent'] || 'Unknown',
      screenResolution: data.screenResolution || 'Unknown',
      language: data.language || 'Unknown',
      timezone: data.timezone || 'Unknown',
      // Server-side data from Netlify
      ip: event.headers['cf-connecting-ip'] ||
          event.headers['x-nf-client-connection-ip'] ||
          event.headers['client-ip'] ||
          'Unknown',
      country: geoData?.country?.code || event.headers['x-country'] || 'Unknown',
      city: geoData?.city || 'Unknown',
      region: geoData?.subdivision?.code || 'Unknown',
      latitude: geoData?.latitude || 'Unknown',
      longitude: geoData?.longitude || 'Unknown',
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

    // Use the sheet name from request data, default to visitor_logs
    const sheetName = data.sheetName || 'visitor_logs';
    const range = `${sheetName}!A:N`; // Adjusted to include Root Domain column

    // Prepare the row data based on sheet type
    let values;

    if (sheetName === 'page_views') {
      // page_views: Timestamp, Referrer, Root Domain, UrlPath, ...
      values = [[
        visitorInfo.humanReadableDate,
        visitorInfo.referrer,
        visitorInfo.domain,
        visitorInfo.urlPath,
        visitorInfo.ip,
        visitorInfo.country,
        visitorInfo.city,
        visitorInfo.region,
        `${visitorInfo.latitude}, ${visitorInfo.longitude}`,
        visitorInfo.sessionId,
        visitorInfo.deviceType,
        visitorInfo.userAgent,
        visitorInfo.screenResolution,
        visitorInfo.language,
      ]];
    } else {
      // visitor_logs: Date, Root Domain, Referrer, UrlPath, ...
      values = [[
        visitorInfo.humanReadableDate,
        visitorInfo.domain,
        visitorInfo.referrer,
        visitorInfo.urlPath,
        visitorInfo.ip,
        visitorInfo.country,
        visitorInfo.city,
        visitorInfo.region,
        `${visitorInfo.latitude}, ${visitorInfo.longitude}`,
        visitorInfo.sessionId,
        visitorInfo.deviceType,
        visitorInfo.userAgent,
        visitorInfo.screenResolution,
        visitorInfo.language,
      ]];
    }

    // Append the data to the sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: {
        values,
      },
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true,
        message: 'Visit logged successfully'
      }),
    };

  } catch (error) {
    console.error('Error logging visit:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to log visit',
        message: error.message 
      }),
    };
  }
};