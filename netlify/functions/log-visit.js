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

    // Debug: Log available headers and context (remove this after debugging)
    console.log('Geo-related headers:', Object.keys(event.headers).filter(h => h.toLowerCase().includes('geo') || h.toLowerCase().includes('country') || h.toLowerCase().includes('city') || h.toLowerCase().includes('nf')));
    console.log('Context geo:', context.geo);
    console.log('All headers:', JSON.stringify(event.headers, null, 2));

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
      referrer: data.referrer || 'Direct',
      urlPath: data.urlPath || '/',
      sessionId: data.sessionId || '',
      deviceType: data.deviceType || 'Unknown',
      userAgent: data.userAgent || event.headers['user-agent'] || 'Unknown',
      screenResolution: data.screenResolution || 'Unknown',
      language: data.language || 'Unknown',
      timezone: data.timezone || 'Unknown',
      // Server-side data from Netlify
      ip: event.headers['x-nf-client-connection-ip'] ||
          event.headers['client-ip'] ||
          'Unknown',
      country: event.headers['x-nf-geo-country-code'] || 'Unknown',
      city: event.headers['x-nf-geo-city'] || 'Unknown',
      region: event.headers['x-nf-geo-subdivision-code'] || 'Unknown',
      latitude: event.headers['x-nf-geo-latitude'] || 'Unknown',
      longitude: event.headers['x-nf-geo-longitude'] || 'Unknown',
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
    const range = 'visitor_logs!A:M'; // Adjust column range as needed

    // Prepare the row data
    const values = [[
      visitorInfo.humanReadableDate,
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