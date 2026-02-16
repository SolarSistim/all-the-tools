/**
 * News Item Interface
 * Represents a news/announcement item for logged-in users
 */
export interface NewsItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  priority: number; // Higher = shown first
  targetRoles?: string[]; // Optional: filter by role (e.g., ['admin'], empty = all users)
  createdAt: string; // ISO date string
  expiresAt?: string; // Optional expiry date
  isRead?: boolean; // Populated on client-side
}

/**
 * User News Read Status
 * Tracks which news items a user has read
 */
export interface UserNewsReadStatus {
  userId: string;
  newsItemId: string;
  readAt: string; // ISO date string
}

/**
 * News Response from API
 */
export interface NewsResponse {
  news: NewsItem[];
  unreadCount: number;
}
