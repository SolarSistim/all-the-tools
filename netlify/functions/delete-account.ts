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

    // Get admin token from environment
    const adminToken = process.env.NETLIFY_ADMIN_TOKEN;

    if (!adminToken) {
      throw new Error('Server configuration error: Missing NETLIFY_ADMIN_TOKEN');
    }

    // The JWT clientContext user has the user UUID in `sub` (standard JWT claim).
    const userId = user.sub || user.id;

    // Use the GoTrue admin API at the site's own URL.
    // Netlify automatically provides process.env.URL as the canonical site URL.
    // The personal access token authenticates admin operations against this endpoint.
    const siteUrl = (process.env.URL || '').replace(/\/$/, '');

    if (!siteUrl || !adminToken) {
      throw new Error('Server configuration error: Missing credentials');
    }

    const deleteUrl = `${siteUrl}/.netlify/identity/admin/users/${userId}`;

    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to delete user:', response.status, errorText);
      throw new Error(`Failed to delete account: ${response.status} ${errorText}`);
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
