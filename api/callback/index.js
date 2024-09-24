const axios = require('axios');

module.exports = async function (context, req) {
  const code = req.query.code;
  const client_id = process.env.GITHUB_CLIENT_ID;
  const client_secret = process.env.GITHUB_CLIENT_SECRET;

  if (!code) {
    context.res = {
      status: 400,
      body: 'Missing code in the request'
    };
    return;
  }

  try {
    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id,
        client_secret,
        code
      },
      {
        headers: { Accept: 'application/json' }
      }
    );

    const accessToken = response.data.access_token;

    if (!accessToken) {
      context.res = {
        status: 500,
        body: 'Failed to retrieve access token'
      };
      return;
    }

    context.res = {
      status: 200,
      headers: {
        'Content-Type': 'text/html'
      },
      body: `
        <script>
          window.opener.postMessage({ token: '${accessToken}' }, '*');
          window.close();
        </script>
      `
    };
  } catch (error) {
    context.log(error);
    context.res = {
      status: 500,
      body: 'Authentication failed'
    };
  }
};
