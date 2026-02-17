// Netlify Function: log-audio-event
// This function logs video player events to Google Sheets

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

    // Only accept video events
    if (data.mediaType !== 'video') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Only video events are logged',
          message: 'This function only accepts video player events'
        }),
      };
    }

    // Extract video event information
    const videoEventInfo = {
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
      action: data.action || 'Unknown', // 'expand-play', 'closed-player', 'opened-in-youtube'
      urlPath: data.urlPath || '/',
      mediaType: 'video',
      country: geoData?.country?.code || event.headers['x-country'] || 'Unknown',
      city: geoData?.city || 'Unknown',
      region: geoData?.subdivision?.code || 'Unknown',
      sessionId: data.sessionId || '',
      deviceType: data.deviceType || 'Unknown',
      userAgent: data.userAgent || event.headers['user-agent'] || 'Unknown',
      screenResolution: data.screenResolution || 'Unknown',
    };

    // Initialize Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/\r/g, ''),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1NDJC3E6n9rGkILd0IKI58vksBSW9eAJQ9gDTzBzoWbs';

    // Use the media_plays sheet
    const sheetName = 'media_plays';
    const range = `${sheetName}!A:K`;

    // Prepare the row data matching the headers:
    // Date, Media Type, Action, URL Path, Country, City, Region, Session ID, Device Type, User Agent, Screen Resolution
    const values = [[
      videoEventInfo.humanReadableDate,
      videoEventInfo.mediaType,
      videoEventInfo.action,
      videoEventInfo.urlPath,
      videoEventInfo.country,
      videoEventInfo.city,
      videoEventInfo.region,
      videoEventInfo.sessionId,
      videoEventInfo.deviceType,
      videoEventInfo.userAgent,
      videoEventInfo.screenResolution,
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
        message: 'Video event logged successfully'
      }),
    };

  } catch (error) {
    console.error('Error logging video event:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to log video event',
        message: error.message
      }),
    };
  }
};
