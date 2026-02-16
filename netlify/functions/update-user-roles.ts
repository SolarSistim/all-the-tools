import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { requireAdmin, handleCORS, errorResponse, successResponse } from './utils/auth';

/**
 * Update User Roles Function
 * Admin-only: Updates roles for a specific user via Netlify Identity Admin API
 */
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return handleCORS();
  }

  try {
    // Require admin role
    requireAdmin(context);

    // Parse request body
    const body = JSON.parse(event.body || '{}');
    const { userId, roles } = body;

    if (!userId || !Array.isArray(roles)) {
      throw new Error('userId and roles array are required');
    }

    // Get Netlify site ID and admin token from environment
    const siteId = process.env.NETLIFY_SITE_ID;
    const adminToken = process.env.NETLIFY_ADMIN_TOKEN;

    if (!siteId || !adminToken) {
      throw new Error('Server configuration error: Missing Netlify credentials');
    }

    // Update user via Netlify Identity Admin API
    const updateUrl = `https://api.netlify.com/api/v1/sites/${siteId}/identity/users/${userId}`;

    const response = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        app_metadata: {
          roles,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to update user roles:', response.status, errorText);
      throw new Error(`Failed to update user roles: ${response.statusText}`);
    }

    const updatedUser = await response.json();

    return successResponse({
      message: 'User roles updated successfully',
      user: updatedUser,
    });
  } catch (error: any) {
    console.error('Error updating user roles:', error);

    if (error.message === 'Unauthorized: Authentication required') {
      return errorResponse(error, 401);
    }

    if (error.message === 'Forbidden: Admin role required') {
      return errorResponse(error, 403);
    }

    return errorResponse(error);
  }
};
