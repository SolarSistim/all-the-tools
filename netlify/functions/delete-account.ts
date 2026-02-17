import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { requireAuth, handleCORS, errorResponse, successResponse } from './utils/auth';

/**
 * Delete Account Function
 * Allows users to delete their own Netlify Identity account
 * DESTRUCTIVE ACTION - permanently deletes user data
 */
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return handleCORS();
  }

  try {
    // Require authentication
    const user = requireAuth(context);

    // Get Netlify site ID and admin token from environment
    const siteId = process.env.NETLIFY_SITE_ID;
    const adminToken = process.env.NETLIFY_ADMIN_TOKEN;

    if (!siteId || !adminToken) {
      throw new Error('Server configuration error: Missing Netlify credentials');
    }

    // The JWT clientContext user has the user UUID in `sub` (standard JWT claim).
    // `id` is not populated from the JWT — use sub, fall back to id.
    const userId = user.sub || user.id;

    // Debug: log the values being used so we can diagnose 404s
    console.log('DEBUG delete-account — siteId:', siteId, '| userId:', userId, '| user keys:', Object.keys(user));

    // Delete user via Netlify Identity Admin API
    const deleteUrl = `https://api.netlify.com/api/v1/sites/${siteId}/identity/users/${userId}`;
    console.log('DEBUG delete-account — DELETE', deleteUrl);

    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to delete user:', response.status, errorText);
      throw new Error(`Failed to delete account: ${response.statusText}`);
    }

    return successResponse({
      message: 'Account deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting account:', error);

    if (error.message === 'Unauthorized: Authentication required') {
      return errorResponse(error, 401);
    }

    return errorResponse(error);
  }
};
