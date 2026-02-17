import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { google } from 'googleapis';
import { requireAuth, handleCORS, errorResponse, successResponse } from './utils/auth';

/**
 * Mark News as Read Function
 * Records that a user has read a specific news item
 */
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return handleCORS();
  }

  try {
    // Require authentication
    const user = requireAuth(context);

    // Parse request body
    const body = JSON.parse(event.body || '{}');
    const { newsItemId } = body;

    if (!newsItemId) {
      throw new Error('newsItemId is required');
    }

    // Setup Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/\r/g, ''),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1NDJC3E6n9rGkILd0IKI58vksBSW9eAJQ9gDTzBzoWbs';

    // Check if already marked as read
    const readStatusResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'news_read_status!A2:C',
    });

    const readStatusRows = readStatusResponse.data.values || [];
    const alreadyRead = readStatusRows.some(
      (row) => row[0] === user.id && row[1] === newsItemId
    );

    if (alreadyRead) {
      // Already marked as read, return success
      return successResponse({
        message: 'Already marked as read',
      });
    }

    // Add read status to Google Sheets
    const readAt = new Date().toISOString();
    const newRow = [user.id, newsItemId, readAt];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'news_read_status!A:C',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [newRow],
      },
    });

    return successResponse({
      message: 'Marked as read',
    });
  } catch (error: any) {
    console.error('Error marking news as read:', error);

    if (error.message === 'Unauthorized: Authentication required') {
      return errorResponse(error, 401);
    }

    return errorResponse(error);
  }
};
