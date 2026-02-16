# User Authentication Setup Guide

This document provides instructions for setting up and configuring the user authentication system for **All The Tools**.

## Table of Contents

1. [Overview](#overview)
2. [Environment Variables](#environment-variables)
3. [Netlify Identity Setup](#netlify-identity-setup)
4. [Google OAuth Configuration](#google-oauth-configuration)
5. [First Admin User Setup](#first-admin-user-setup)
6. [Google Sheets Setup](#google-sheets-setup)
7. [Testing Checklist](#testing-checklist)
8. [Troubleshooting](#troubleshooting)

---

## Overview

The authentication system uses **Netlify Identity** for user management with the following features:

- ✅ Email/password authentication
- ✅ Google OAuth login
- ✅ Automatic ad-free browsing for logged-in users
- ✅ Role-based access control (user, admin)
- ✅ My Account page with news and profile management
- ✅ Admin dashboard for user management
- ✅ Secure Netlify Functions with JWT validation

---

## Environment Variables

Add the following environment variables in the Netlify dashboard under **Site settings → Environment variables**:

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NETLIFY_SITE_ID` | Your Netlify site ID | `abc123...` |
| `NETLIFY_ADMIN_TOKEN` | Netlify Personal Access Token | `nfp_xxx...` |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Google Sheets API email | `your-service@...` |
| `GOOGLE_PRIVATE_KEY` | Google Sheets API private key | `-----BEGIN PRIVATE KEY-----\n...` |
| `GMAIL_USER` | Gmail sender address (existing) | `allthethings.dev@gmail.com` |
| `GMAIL_APP_PASSWORD` | Gmail app password (existing) | `xxx...` |
| `RECAPTCHA_SECRET_KEY` | reCAPTCHA secret (existing) | `xxx...` |

### How to Get Environment Variables

**NETLIFY_SITE_ID:**
- Found in Netlify dashboard → Site settings → General → Site details → Site ID

**NETLIFY_ADMIN_TOKEN:**
1. Go to https://app.netlify.com/user/applications
2. Click "New access token"
3. Name it "All The Tools Admin"
4. Copy the token and save it securely

---

## Netlify Identity Setup

### Step 1: Enable Identity

1. Go to your Netlify site dashboard
2. Navigate to **Identity** tab
3. Click **Enable Identity**

### Step 2: Configure Registration Settings

1. In Identity settings, go to **Registration**
2. **Registration preferences:**
   - Start with **"Invite only"** for initial setup
   - Switch to **"Open"** once you've tested everything
3. **External providers:**
   - Enable **Google**
4. **Email templates:**
   - Customize confirmation and password reset emails (optional)

### Step 3: Configure Identity Settings

1. **JWT expiration:** 1 hour (default)
2. **Refresh token rotation:** Enabled (recommended)
3. **Email confirmation:** Required (recommended for production)

---

## Google OAuth Configuration

### Prerequisites

- Google Cloud Console project
- OAuth 2.0 Client ID configured

### Step 1: Create OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create one)
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Add authorized redirect URIs:
   ```
   https://allthetools.dev/.netlify/identity/callback
   ```
7. Copy **Client ID** and **Client Secret**

### Step 2: Configure in Netlify

1. In Netlify Identity settings → **External providers**
2. Click **Google** to expand
3. Enter your **Client ID** and **Client Secret**
4. Save settings

---

## First Admin User Setup

After deploying the authentication system, you need to manually assign the admin role to the first user.

### Step 1: Create First User

1. Go to https://allthetools.dev
2. Click "Login" and create an account
3. Verify your email (if confirmation enabled)

### Step 2: Get User ID

**Option A: Via Netlify Dashboard**
1. Go to Netlify dashboard → Identity
2. Find your user in the list
3. Copy the User ID

**Option B: Via API**
```bash
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \ 
  https://api.netlify.com/api/v1/sites/YOUR_SITE_ID/identity/users
```

### Step 3: Assign Admin Role

Using the Netlify API:

```bash
curl -X PUT \
  https://api.netlify.com/api/v1/sites/YOUR_SITE_ID/identity/users/USER_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "app_metadata": {
      "roles": ["admin"]
    }
  }'
```

Replace:
- `YOUR_SITE_ID` with your Netlify site ID
- `YOUR_ADMIN_TOKEN` with your Netlify access token
- `USER_ID` with the user's ID

### Step 4: Verify Admin Access

1. Log in to the site
2. You should see "Admin Dashboard" in the account menu
3. Navigate to `/admin` to access the admin dashboard

---

## Google Sheets Setup

The news system uses Google Sheets to store news items and read status.

### Step 1: Create Sheets

In your existing Google Sheet (`1NDJC3E6n9rGkILd0IKI58vksBSW9eAJQ9gDTzBzoWbs`), add two new sheets:

#### Sheet 1: `news_items`

Columns:
| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| id | title | message | type | priority | targetRoles | createdAt | expiresAt |

**Example Row:**
```
1, Welcome to All The Tools!, Thank you for creating an account..., info, 100, , 2024-01-15T00:00:00Z,
```

#### Sheet 2: `news_read_status`

Columns:
| A | B | C |
|---|---|---|
| userId | newsItemId | readAt |

**Example Row:**
```
user-abc-123, 1, 2024-01-16T10:30:00Z
```

### Step 2: Add Sample News Item

Add a test news item to verify the system works:

```
id: 1
title: Welcome to All The Tools!
message: Thanks for creating an account! Enjoy ad-free browsing and stay tuned for updates.
type: info
priority: 100
targetRoles: (leave empty for all users)
createdAt: 2024-01-15T00:00:00Z
expiresAt: (leave empty for no expiry)
```

---

## Testing Checklist

Use this checklist to verify the authentication system is working correctly.

### ✅ Authentication Flow

- [ ] User can register with email/password
- [ ] User can login with email/password
- [ ] User can login with Google OAuth
- [ ] User stays logged in after page refresh
- [ ] User can logout successfully
- [ ] Unauthenticated users are redirected from protected routes

### ✅ Ad-Free Experience

- [ ] Ads visible when logged out
- [ ] Ads hidden immediately when logged in
- [ ] No flash of ads on page load (authenticated users)
- [ ] SSG pages render correctly with ads by default
- [ ] Client-side hydration hides ads for authenticated users

### ✅ My Account Page

- [ ] Account page requires authentication (redirects if not logged in)
- [ ] News tab displays news items
- [ ] Can mark news as read
- [ ] Unread count updates correctly
- [ ] Profile tab displays user info (email, name, role)
- [ ] "Ad-Free Active" badge visible
- [ ] Can trigger password reset flow
- [ ] Can delete account with confirmation dialog
- [ ] Account deletion works and logs user out

### ✅ Admin Dashboard

- [ ] Admin page requires admin role
- [ ] Non-admin users cannot access (redirected)
- [ ] User list displays all users
- [ ] Can search/filter users
- [ ] Can assign admin role to user
- [ ] Can remove admin role from user
- [ ] Changes persist after page refresh

### ✅ Security

- [ ] Protected Netlify Functions reject requests without JWT
- [ ] Admin functions reject requests from non-admin users
- [ ] JWT validation works correctly
- [ ] Tampered JWTs are rejected
- [ ] Account deletion only works for own account (not other users)

### ✅ Browser Compatibility

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### ✅ SSR/SSG Testing

- [ ] `npm run build` completes successfully
- [ ] Prerendered pages contain default state (ads visible, no auth UI)
- [ ] Client-side hydration works correctly
- [ ] No console errors during hydration

---

## Troubleshooting

### Issue: "Unauthorized" errors in Netlify Functions

**Solution:**
- Verify JWT token is being sent in Authorization header
- Check that Netlify Identity is enabled
- Ensure user is logged in before making API calls

### Issue: Google OAuth login fails

**Solution:**
- Verify OAuth credentials in Google Cloud Console
- Check authorized redirect URIs include: `https://allthetools.dev/.netlify/identity/callback`
- Ensure Google OAuth is enabled in Netlify Identity settings

### Issue: Admin dashboard shows "Forbidden"

**Solution:**
- Verify admin role is assigned in user's `app_metadata.roles`
- Check NETLIFY_ADMIN_TOKEN environment variable is set
- Ensure adminGuard is protecting the `/admin` route

### Issue: News items not loading

**Solution:**
- Verify Google Sheets API credentials are correct
- Check `news_items` sheet exists and has correct structure
- Verify Google Service Account has access to the spreadsheet

### Issue: Ads still showing for logged-in users

**Solution:**
- Check browser console for JavaScript errors
- Verify AdsenseService is injecting AuthService
- Ensure AdSense component is using `shouldShowAds$` observable
- Clear browser cache and hard refresh

### Issue: Password reset not working

**Solution:**
- Verify email templates are configured in Netlify Identity
- Check email provider settings (make sure emails aren't in spam)
- Ensure password reset is enabled in Identity settings

---

## Architecture Notes

### How Roles Work

- Roles stored in JWT claim: `app_metadata.roles: string[]`
- Client reads from decoded JWT for UI/UX decisions
- Server validates JWT signature and checks roles in Netlify Functions
- First admin assigned manually via Netlify API
- Subsequent admins via admin dashboard

### Ad-Free Logic

```
Show ads when: environment.adsEnabled === true AND user is NOT authenticated
Hide ads when: user IS authenticated
```

### Security Model

| Layer | Purpose | Trust Level |
|-------|---------|-------------|
| Client-side | UX/UI control | UNTRUSTED |
| Server-side | Security boundary | TRUSTED |

All protected Netlify Functions validate JWT signature and check roles server-side.

---

## Support

If you encounter issues:

1. Check the browser console for errors
2. Review Netlify function logs
3. Verify all environment variables are set correctly
4. Test with a fresh incognito window

For production issues, check:
- Netlify build logs
- Netlify function logs
- Google Sheets API quota

---

## Next Steps

After setup is complete:

1. ✅ Test all features thoroughly
2. ✅ Switch registration from "Invite only" to "Open"
3. ✅ Add initial news items for users
4. ✅ Monitor function logs for errors
5. ✅ Set up monitoring/alerts (optional)

---

**Last Updated:** 2024
**Maintained By:** All The Tools Team
