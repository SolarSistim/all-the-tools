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

    // The JWT clientContext user has the user UUID in `sub` (standard JWT claim).
    const userId = user.sub || user.id;

    // Forward the caller's own JWT to the GoTrue admin API.
    // NETLIFY_ADMIN_TOKEN is an opaque PAT and is not a JWT — GoTrue rejects it.
    // A user with the 'admin' role in their JWT can call GoTrue admin endpoints.
    const authHeader = event.headers['authorization'] || event.headers['Authorization'] || '';
    const siteUrl = (process.env.URL || '').replace(/\/$/, '');

    if (!siteUrl) {
      throw new Error('Server configuration error: Missing site URL');
    }

    const deleteUrl = `${siteUrl}/.netlify/identity/admin/users/${userId}`;

    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': authHeader,
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
