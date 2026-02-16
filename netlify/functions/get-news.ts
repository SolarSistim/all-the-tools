import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { google } from 'googleapis';
import { requireAuth, handleCORS, errorResponse, successResponse } from './utils/auth';

/**
 * Get News Function
 * Fetches news items for authenticated users
 * Filters by user role (admin sees admin-only news)
 */
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return handleCORS();
  }

  try {
    // Require authentication
    const user = requireAuth(context);
    const userRoles = user.app_metadata?.roles || ['user'];

    // Setup Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1NDJC3E6n9rGkILd0IKI58vksBSW9eAJQ9gDTzBzoWbs';

    // Fetch news items from Google Sheets
    const newsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'news_items!A2:H', // Skip header row
    });

    const newsRows = newsResponse.data.values || [];

    // Parse news items
    const newsItems = newsRows.map((row) => {
      const [id, title, message, type, priority, targetRoles, createdAt, expiresAt] = row;
      return {
        id: id || '',
        title: title || '',
        message: message || '',
        type: type || 'info',
        priority: parseInt(priority || '0', 10),
        targetRoles: targetRoles ? targetRoles.split(',').map((r: string) => r.trim()) : [],
        createdAt: createdAt || new Date().toISOString(),
        expiresAt: expiresAt || null,
      };
    });

    // Filter news by role and expiry
    const now = new Date();
    const filteredNews = newsItems.filter((item) => {
      // Check if expired
      if (item.expiresAt) {
        const expiryDate = new Date(item.expiresAt);
        if (expiryDate < now) {
          return false; // Expired
        }
      }

      // Check role targeting
      if (item.targetRoles && item.targetRoles.length > 0) {
        // If targetRoles specified, user must have one of those roles
        const hasRequiredRole = item.targetRoles.some((role: string) =>
          userRoles.includes(role)
        );
        return hasRequiredRole;
      }

      // No role restriction, show to all
      return true;
    });

    // Sort by priority (descending) then by createdAt (newest first)
    filteredNews.sort((a, b) => {
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Fetch read status for this user
    const readStatusResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'news_read_status!A2:C',
    });

    const readStatusRows = readStatusResponse.data.values || [];
    const readNewsIds = new Set(
      readStatusRows
        .filter((row) => row[0] === user.id) // userId matches
        .map((row) => row[1]) // newsItemId
    );

    // Mark items as read/unread
    const newsWithReadStatus = filteredNews.map((item) => ({
      ...item,
      isRead: readNewsIds.has(item.id),
    }));

    // Count unread items
    const unreadCount = newsWithReadStatus.filter((item) => !item.isRead).length;

    return successResponse({
      news: newsWithReadStatus,
      unreadCount,
    });
  } catch (error: any) {
    console.error('Error fetching news:', error);

    if (error.message === 'Unauthorized: Authentication required') {
      return errorResponse(error, 401);
    }

    return errorResponse(error);
  }
};
