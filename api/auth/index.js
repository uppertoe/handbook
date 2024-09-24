module.exports = async function (context, req) {
    const client_id = process.env.GH_CLIENT_ID;
    const redirect_uri = encodeURIComponent(`${process.env.AUTH_SERVER_URL}/api/callback`);
    const scope = 'repo';
  
    if (!client_id || !process.env.AUTH_SERVER_URL) {
      context.res = {
        status: 500,
        body: 'Server configuration error.'
      };
      return;
    }
  
    context.res = {
      status: 302,
      headers: {
        Location: `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}`
      }
    };
  };
  