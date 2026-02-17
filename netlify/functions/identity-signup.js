// Netlify Identity Event Function: identity-signup
// Automatically assigns the 'user' role to every newly confirmed account.
// Netlify calls this function after a user confirms their email.
// Whatever app_metadata is returned here gets merged onto the user record.

const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  const payload = JSON.parse(event.body);
  const user = payload.user;

  console.log(`[identity-signup] New user confirmed: ${user?.email}`);

  // Send signup notification email
  try {
    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

    if (gmailUser && gmailAppPassword) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailAppPassword,
        },
      });

      const email = user?.email || 'Unknown';
      const fullName = user?.user_metadata?.full_name || user?.user_metadata?.name || 'Not provided';
      const provider = user?.app_metadata?.provider || 'email';
      const signupTime = user?.created_at
        ? new Date(user.created_at).toLocaleString('en-US', {
            timeZone: 'America/Chicago',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
          })
        : new Date().toLocaleString('en-US', {
            timeZone: 'America/Chicago',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
          });

      const providerLabel = provider === 'google'
        ? 'Google OAuth'
        : provider === 'github'
        ? 'GitHub OAuth'
        : 'Email / Password';

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
            <p style="margin: 10px 0;"><strong>Signed Up:</strong> ${signupTime} (CT)</p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
            <p>This notification was sent automatically from AllTheThings.dev.</p>
          </div>
        </div>
      `;

      const emailText = `
New User Signup — AllTheThings.dev

Email: ${email}
Name: ${fullName}
Sign-in Method: ${providerLabel}
Signed Up: ${signupTime} (CT)

---
This notification was sent automatically from AllTheThings.dev.
      `.trim();

      await transporter.sendMail({
        from: `"AllTheThings.dev" <${gmailUser}>`,
        to: 'allthethings.dev@gmail.com',
        subject: `New signup: ${email}`,
        text: emailText,
        html: emailHtml,
      });

      console.log(`[identity-signup] Notification email sent for ${email}`);
    } else {
      console.warn('[identity-signup] Gmail credentials not configured — skipping notification email');
    }
  } catch (emailError) {
    // Don't fail the function if email sending fails — role assignment must succeed
    console.error('[identity-signup] Failed to send notification email:', emailError);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      app_metadata: {
        roles: ['user']
      }
    })
  };
};
