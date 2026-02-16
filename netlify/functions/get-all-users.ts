import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { requireAdmin, handleCORS, errorResponse, successResponse } from './utils/auth';

/**
 * Get All Users Function
 * Admin-only: Fetches all users from Netlify Identity
 */
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return handleCORS();
  }

  try {
    // Require admin role
    requireAdmin(context);

    // Get Netlify site ID and admin token from environment
    const siteId = process.env.NETLIFY_SITE_ID;
    const adminToken = process.env.NETLIFY_ADMIN_TOKEN;

    if (!siteId || !adminToken) {
      throw new Error('Server configuration error: Missing Netlify credentials');
    }

    // Fetch all users from Netlify Identity Admin API
    const usersUrl = `https://api.netlify.com/api/v1/sites/${siteId}/identity/users`;

    const response = await fetch(usersUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch users:', response.status, errorText);
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }

    const data = await response.json();
    const users = data.users || [];

    return successResponse({
      users,
      total: users.length,
    });
  } catch (error: any) {
    console.error('Error fetching users:', error);

    if (error.message === 'Unauthorized: Authentication required') {
      return errorResponse(error, 401);
    }

    if (error.message === 'Forbidden: Admin role required') {
      return errorResponse(error, 403);
    }

    return errorResponse(error);
  }
};
