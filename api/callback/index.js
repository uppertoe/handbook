const axios = require('axios');

module.exports = async function (context, req) {
  const code = req.query.code;
  const client_id = process.env.GH_CLIENT_ID;
  const client_secret = process.env.GH_CLIENT_SECRET;

  if (!code) {
    context.res = {
      status: 400,
      body: 'Missing code parameter.'
    };
    return;
  }

  if (!client_id || !client_secret) {
    context.res = {
      status: 500,
      body: 'Server configuration error.'
    };
    return;
  }

  try {
    const tokenResponse = await axios.post(
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

    const accessToken = tokenResponse.data.access_token;

    if (!accessToken) {
      context.res = {
        status: 500,
        body: 'Failed to retrieve access token.'
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
        console.log('Access token:', '${accessToken}');
        console.log('window.opener is', window.opener ? 'available' : 'null or undefined');
  
        if (window.opener) {
          window.opener.postMessage({ token: '${accessToken}' }, '*');
          window.close();
        } else {
          alert('Unable to communicate with the main window.');
        }
      </script>
    `,
    };
  } catch (error) {
    context.log('Error exchanging code for token:', error);
    context.res = {
      status: 500,
      body: 'Authentication failed.'
    };
  }
};
