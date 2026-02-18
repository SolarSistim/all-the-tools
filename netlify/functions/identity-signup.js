// Netlify Identity Event Function: identity-signup
// Assigns the 'user' role when a user confirms an email/password account.
//
// NOTE: This event is unreliable for Google/GitHub OAuth first-time signups.
// Role assignment and email notification for OAuth users is handled in
// identity-login.js instead, which fires consistently for all providers.

exports.handler = async (event, context) => {
  const payload = JSON.parse(event.body);
  const user = payload.user;

  console.log(`[identity-signup] New user confirmed: ${user?.email}`);

  return {
    statusCode: 200,
    body: JSON.stringify({
      app_metadata: {
        roles: ['user']
      }
    })
  };
};
