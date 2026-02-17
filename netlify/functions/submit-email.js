// Netlify Function: submit-email
// This function logs email list submissions to Google Sheets

const { google } = require('googleapis');
const nodemailer = require('nodemailer');

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

    // Validate email
    if (!data.email || !data.email.trim()) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email is required' }),
      };
    }

    // Decode Netlify geo data from x-nf-geo header (base64 encoded JSON)
    let geoData = null;
    if (event.headers['x-nf-geo']) {
      try {
        const decoded = Buffer.from(event.headers['x-nf-geo'], 'base64').toString('utf-8');
        geoData = JSON.parse(decoded);
      } catch (error) {
        console.error('Error decoding geo data:', error);
      }
    }

    // Extract submission information
    const submissionInfo = {
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
      email: data.email.trim().toLowerCase(),
      referrer: data.referrer || 'Direct',
      urlPath: data.urlPath || '/',
      // Server-side data from Netlify
      ip: event.headers['cf-connecting-ip'] ||
          event.headers['x-nf-client-connection-ip'] ||
          event.headers['client-ip'] ||
          'Unknown',
      country: geoData?.country?.code || event.headers['x-country'] || 'Unknown',
      city: geoData?.city || 'Unknown',
      region: geoData?.subdivision?.code || 'Unknown',
      userAgent: event.headers['user-agent'] || 'Unknown',
    };

    // Initialize Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/\r/g, ''),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1NDJC3E6n9rGkILd0IKI58vksBSW9eAJQ9gDTzBzoWbs';

    // Target the email_list_submissions tab
    const sheetName = 'email_list_submissions';
    const range = `${sheetName}!A:I`; // Adjust column range as needed

    // Prepare the row data
    const values = [[
      submissionInfo.humanReadableDate,
      submissionInfo.email,
      submissionInfo.referrer,
      submissionInfo.urlPath,
      submissionInfo.ip,
      submissionInfo.country,
      submissionInfo.city,
      submissionInfo.region,
      submissionInfo.userAgent,
    ]];

    // Append the data to the sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: {
        values,
      },
    });

    // Send email notification
    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

    if (gmailUser && gmailAppPassword) {
      try {
        // Create transporter using Gmail
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: gmailUser,
            pass: gmailAppPassword,
          },
        });

        // Prepare email content
        const emailSubject = `New Newsletter Signup: ${submissionInfo.email}`;

        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #6DD4FF; border-bottom: 2px solid #6DD4FF; padding-bottom: 10px;">
              New Newsletter Signup
            </h2>

            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">Subscriber Information</h3>
              <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${submissionInfo.email}">${submissionInfo.email}</a></p>
            </div>

            <div style="background-color: #fff; padding: 20px; border-left: 4px solid #6DD4FF; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">Submission Details</h3>
              <p style="margin: 10px 0;"><strong>Page:</strong> ${submissionInfo.urlPath}</p>
              <p style="margin: 10px 0;"><strong>Referrer:</strong> ${submissionInfo.referrer}</p>
              <p style="margin: 10px 0;"><strong>Location:</strong> ${submissionInfo.city}, ${submissionInfo.region}, ${submissionInfo.country}</p>
              <p style="margin: 10px 0;"><strong>IP Address:</strong> ${submissionInfo.ip}</p>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
              <p>Submitted on: ${submissionInfo.humanReadableDate}</p>
              <p>This signup was submitted from the All The Tools newsletter form.</p>
            </div>
          </div>
        `;

        const emailText = `
New Newsletter Signup

Subscriber Information:
Email: ${submissionInfo.email}

Submission Details:
Page: ${submissionInfo.urlPath}
Referrer: ${submissionInfo.referrer}
Location: ${submissionInfo.city}, ${submissionInfo.region}, ${submissionInfo.country}
IP Address: ${submissionInfo.ip}

---
Submitted on: ${submissionInfo.humanReadableDate}
This signup was submitted from the All The Tools newsletter form.
        `.trim();

        // Send email
        const mailOptions = {
          from: `"All The Tools Newsletter" <${gmailUser}>`,
          to: 'allthethings.dev@gmail.com',
          subject: emailSubject,
          text: emailText,
          html: emailHtml,
        };

        await transporter.sendMail(mailOptions);
        console.log('Newsletter signup notification email sent successfully');
      } catch (emailError) {
        console.error('Error sending notification email:', emailError);
        // Don't fail the request if email fails - the data was still saved to sheets
      }
    } else {
      console.warn('Gmail credentials not configured - skipping email notification');
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Email submitted successfully'
      }),
    };

  } catch (error) {
    console.error('Error submitting email:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to submit email',
        message: error.message
      }),
    };
  }
};
