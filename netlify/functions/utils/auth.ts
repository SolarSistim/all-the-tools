import { Context } from '@netlify/functions';

/**
 * Netlify User Interface
 * Represents the user object from Netlify Identity
 */
export interface NetlifyUser {
  id: string;
  sub: string; // JWT standard claim — the actual user UUID from Netlify Identity
  email: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
  app_metadata?: {
    roles?: string[];
    provider?: string;
    [key: string]: any;
  };
  created_at?: string;
  confirmed_at?: string;
}

/**
 * Validate JWT token from request context
 * Returns user object if valid, null if invalid
 */
export function validateJWT(context: Context): NetlifyUser | null {
  if (!context.clientContext?.user) {
    return null;
  }
  return context.clientContext.user as NetlifyUser;
}

/**
 * Require authentication
 * Throws error if user is not authenticated
 */
export function requireAuth(context: Context): NetlifyUser {
  const user = validateJWT(context);
  if (!user) {
    throw new Error('Unauthorized: Authentication required');
  }
  return user;
}

/**
 * Require admin role
 * Throws error if user is not authenticated or not an admin
 */
export function requireAdmin(context: Context): NetlifyUser {
  const user = requireAuth(context);
  const roles = user.app_metadata?.roles || [];

  if (!roles.includes('admin')) {
    throw new Error('Forbidden: Admin role required');
  }

  return user;
}

/**
 * Check if user has a specific role
 */
export function hasRole(user: NetlifyUser, role: string): boolean {
  const roles = user.app_metadata?.roles || [];
  return roles.includes(role);
}

/**
 * Standard CORS headers for all responses
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

/**
 * Handle OPTIONS request for CORS preflight
 */
export function handleCORS() {
  return {
    statusCode: 200,
    headers: corsHeaders,
    body: '',
  };
}

/**
 * Create error response
 */
export function errorResponse(error: any, statusCode: number = 500) {
  const message = error instanceof Error ? error.message : 'Internal server error';

  return {
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify({
      error: message,
      success: false
    }),
  };
}

/**
 * Create success response
 */
export function successResponse(data: any, statusCode: number = 200) {
  return {
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify({
      ...data,
      success: true
    }),
  };
}
