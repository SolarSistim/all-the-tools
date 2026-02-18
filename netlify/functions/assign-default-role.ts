import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { requireAuth, handleCORS, errorResponse, successResponse } from './utils/auth';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer');

/**
 * Assign Default Role Function
 *
 * Called client-side after OAuth login when a new user has no roles.
 * Uses the Netlify Admin API to assign the 'user' role to the caller's own account.
 * Also sends a signup notification email.
 *
 * This is the reliable fallback for Identity event functions (identity-signup /
 * identity-login), which don't fire consistently for Google OAuth.
 */
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (event.httpMethod === 'OPTIONS') return handleCORS();
  if (event.httpMethod !== 'POST') return errorResponse(new Error('Method not allowed'), 405);

  try {
    // Require a valid JWT — the user can only assign a role to themselves
    const user = requireAuth(context);
    const existingRoles = user.app_metadata?.roles || [];

    // Already has at least one role — nothing to do
    if (existingRoles.length > 0) {
      return successResponse({ roles: existingRoles, assigned: false });
    }

    const siteId = process.env.NETLIFY_SITE_ID;
    const adminToken = process.env.NETLIFY_ADMIN_TOKEN;

    if (!siteId || !adminToken) {
      throw new Error('Server configuration error: Missing Netlify credentials');
    }

    // Assign 'user' role via Netlify Identity Admin API
    const updateUrl = `https://api.netlify.com/api/v1/sites/${siteId}/identity/users/${user.sub}`;

    const response = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        app_metadata: { roles: ['user'] },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[assign-default-role] Admin API error:', response.status, errorText);
      throw new Error(`Failed to assign role: ${response.statusText}`);
    }

    console.log(`[assign-default-role] Assigned 'user' role to: ${user.email}`);

    // Send signup notification email (non-blocking — never fail the role assignment)
    try {
      const gmailUser = process.env.GMAIL_USER;
      const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

      if (gmailUser && gmailAppPassword) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: gmailUser, pass: gmailAppPassword },
        });

        const email = user.email || 'Unknown';
        const fullName = user.user_metadata?.full_name || 'Not provided';
        const provider = user.app_metadata?.provider || 'email';
        const signupTime = new Date().toLocaleString('en-US', {
          timeZone: 'America/Chicago',
          year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
        });
        const providerLabel =
          provider === 'google' ? 'Google OAuth' :
          provider === 'github' ? 'GitHub OAuth' :
          'Email / Password';

        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #6DD4FF; border-bottom: 2px solid #6DD4FF; padding-bottom: 10px;">
              New User Signup
            </h2>
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">User Details</h3>
              <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p style="margin: 10px 0;"><strong>Name:</strong> ${fullName}</p>
              <p style="margin: 10px 0;"><strong>Sign-in Method:</strong> ${providerLabel}</p>
              <p style="margin: 10px 0;"><strong>Time:</strong> ${signupTime} (CT)</p>
            </div>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
              <p>This notification was sent automatically from AllTheThings.dev.</p>
            </div>
          </div>
        `;

        await transporter.sendMail({
          from: `"AllTheThings.dev" <${gmailUser}>`,
          to: 'allthethings.dev@gmail.com',
          subject: `New signup: ${email}`,
          text: `New signup — AllTheThings.dev\n\nEmail: ${email}\nName: ${fullName}\nProvider: ${providerLabel}\nTime: ${signupTime} (CT)`,
          html: emailHtml,
        });

        console.log(`[assign-default-role] Notification email sent for ${email}`);
      }
    } catch (emailErr) {
      console.error('[assign-default-role] Email notification failed:', emailErr);
    }

    return successResponse({ roles: ['user'], assigned: true });

  } catch (error: any) {
    console.error('[assign-default-role] Error:', error);

    if (error.message === 'Unauthorized: Authentication required') {
      return errorResponse(error, 401);
    }

    return errorResponse(error);
  }
};
