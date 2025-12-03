// Netlify Function: submit-contact
// This function handles contact form submissions and sends emails via Gmail

const nodemailer = require('nodemailer');
const https = require('https');

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse the request body
    const data = JSON.parse(event.body);

    // Validate required fields
    if (!data.email || !data.email.trim()) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email is required' }),
      };
    }

    if (!data.recaptchaToken) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'reCAPTCHA verification required' }),
      };
    }

    // Verify reCAPTCHA token with Google
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    if (!recaptchaSecret) {
      console.error('RECAPTCHA_SECRET_KEY not configured');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Server configuration error' }),
      };
    }

    const recaptchaResponse = await verifyRecaptcha(data.recaptchaToken, recaptchaSecret);

    if (!recaptchaResponse.success) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'reCAPTCHA verification failed' }),
      };
    }

    // Validate Gmail configuration
    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

    if (!gmailUser || !gmailAppPassword) {
      console.error('Gmail credentials not configured');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Email service not configured' }),
      };
    }

    // Extract form data
    const submissionData = {
      firstName: data.firstName?.trim() || '',
      lastName: data.lastName?.trim() || '',
      phone: data.phone?.trim() || '',
      email: data.email.trim(),
      message: data.message?.trim() || '',
      timestamp: new Date().toISOString(),
      humanReadableDate: new Date().toLocaleString('en-US', {
        timeZone: 'America/Chicago',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }),
    };

    // Create transporter using Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    });

    // Prepare email content
    const fullName = `${submissionData.firstName} ${submissionData.lastName}`.trim() || 'Anonymous';
    const emailSubject = `New Contact Form Submission from ${fullName}`;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6DD4FF; border-bottom: 2px solid #6DD4FF; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>

        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Contact Information</h3>
          <p style="margin: 10px 0;"><strong>Name:</strong> ${fullName}</p>
          <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${submissionData.email}">${submissionData.email}</a></p>
          <p style="margin: 10px 0;"><strong>Phone:</strong> ${submissionData.phone || 'Not provided'}</p>
        </div>

        ${submissionData.message ? `
        <div style="background-color: #fff; padding: 20px; border-left: 4px solid #6DD4FF; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Message</h3>
          <p style="white-space: pre-wrap; line-height: 1.6;">${submissionData.message}</p>
        </div>
        ` : ''}

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
          <p>Submitted on: ${submissionData.humanReadableDate}</p>
          <p>This message was sent from the All The Tools contact form.</p>
        </div>
      </div>
    `;

    const emailText = `
New Contact Form Submission

Contact Information:
Name: ${fullName}
Email: ${submissionData.email}
Phone: ${submissionData.phone || 'Not provided'}

${submissionData.message ? `Message:\n${submissionData.message}\n` : ''}

---
Submitted on: ${submissionData.humanReadableDate}
This message was sent from the All The Tools contact form.
    `.trim();

    // Send email
    const mailOptions = {
      from: `"All The Tools Contact Form" <${gmailUser}>`,
      to: 'cwmpensacola@gmail.com',
      replyTo: submissionData.email,
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
    };

    await transporter.sendMail(mailOptions);

    console.log('Contact form email sent successfully');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Contact form submitted successfully'
      }),
    };

  } catch (error) {
    console.error('Error submitting contact form:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to submit contact form',
        message: error.message
      }),
    };
  }
};

/**
 * Verify reCAPTCHA token with Google
 */
function verifyRecaptcha(token, secret) {
  return new Promise((resolve, reject) => {
    const postData = new URLSearchParams({
      secret: secret,
      response: token,
    }).toString();

    const options = {
      hostname: 'www.google.com',
      port: 443,
      path: '/recaptcha/api/siteverify',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve(response);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}
