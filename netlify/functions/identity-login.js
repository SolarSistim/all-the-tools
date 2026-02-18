// Netlify Identity Event Function: identity-login
// Fires on EVERY login (email and OAuth). Used to reliably assign the 'user'
// role on first login and send a signup notification email for new accounts.
//
// Unlike identity-signup (which is unreliable for Google/GitHub OAuth), this
// event fires consistently for all providers. We detect "new user" by checking
// whether the account has no roles yet.

const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  const payload = JSON.parse(event.body);
  const user = payload.user;
  const existingRoles = user?.app_metadata?.roles || [];

  // Returning user — nothing to change
  if (existingRoles.length > 0) {
    return { statusCode: 200, body: JSON.stringify({}) };
  }

  // ── New user (no roles yet) ──────────────────────────────────────────────
  console.log(`[identity-login] First login — assigning 'user' role to: ${user?.email}`);

  // Send signup notification email (errors here must not block role assignment)
  try {
    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

    if (gmailUser && gmailAppPassword) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: gmailUser, pass: gmailAppPassword },
      });

      const email = user?.email || 'Unknown';
      const fullName = user?.user_metadata?.full_name || user?.user_metadata?.name || 'Not provided';
      const provider = user?.app_metadata?.provider || 'email';
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

      console.log(`[identity-login] Notification email sent for ${email}`);
    }
  } catch (emailErr) {
    // Never block role assignment because of email failure
    console.error('[identity-login] Email notification failed:', emailErr);
  }

  // Assign 'user' role — Netlify merges this into app_metadata and includes
  // it in the JWT issued for this session, so roles are available immediately.
  return {
    statusCode: 200,
    body: JSON.stringify({
      app_metadata: { roles: ['user'] }
    })
  };
};
