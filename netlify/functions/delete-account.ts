import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { requireAuth, handleCORS, errorResponse, successResponse } from './utils/auth';

/**
 * Delete Account Function
 * Uses Type Casting to access Identity context in v1 Functions
 */
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // 1. Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return handleCORS();
  }

  try {
    // 2. Authenticate the user
    // Casting context to 'any' here solves the "Argument of type..." error
    const user = requireAuth(context as any);

    // 3. Extract Identity details via Type Casting
    // In v1, these live inside clientContext
    const clientContext = (context as any).clientContext;
    const userId = clientContext?.user?.sub;
    const adminToken = clientContext?.identity?.token;

    if (!userId || !adminToken) {
      console.error('Identity context missing:', { hasUserId: !!userId, hasToken: !!adminToken });
      throw new Error('Server configuration error: Identity context not found');
    }

    // 4. Construct the Admin API URL
    const siteUrl = (process.env.URL || '').replace(/\/$/, '');
    const deleteUrl = `${siteUrl}/.netlify/identity/admin/users/${userId}`;

    // 5. Execute the deletion using the Admin Token
    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete account: ${response.status} ${errorText}`);
    }

    return successResponse({
      message: 'Account deleted successfully',
    });

  } catch (error: any) {
    console.error('Error deleting account:', error.message);
    
    const statusCode = error.message.includes('Authentication') ? 401 : 500;
    return errorResponse(error, statusCode);
  }
};