// Netlify Identity Event Function: identity-signup
// Automatically assigns the 'user' role to every newly confirmed account.
// Netlify calls this function after a user confirms their email.
// Whatever app_metadata is returned here gets merged onto the user record.

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
