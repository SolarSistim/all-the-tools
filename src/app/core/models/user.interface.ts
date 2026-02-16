/**
 * Netlify Identity User Interface
 * Represents a user from Netlify Identity service
 */
export interface NetlifyUser {
  id: string;
  email: string;
  user_metadata?: UserMetadata;
  app_metadata?: AppMetadata;
  created_at: string;
  confirmed_at?: string;
  token?: UserToken;
}

/**
 * User-editable metadata
 */
export interface UserMetadata {
  full_name?: string;
  avatar_url?: string;
}

/**
 * Application metadata (managed server-side)
 */
export interface AppMetadata {
  roles?: string[];
  provider?: string;
  [key: string]: any;
}

/**
 * JWT Token information
 */
export interface UserToken {
  access_token: string;
  expires_at: number;
  refresh_token: string;
  token_type: string;
}

/**
 * User role types
 */
export type UserRole = 'user' | 'admin';

/**
 * User role constants
 */
export const UserRoles = {
  USER: 'user' as UserRole,
  ADMIN: 'admin' as UserRole
};
