const {ClientCredentials} = require("simple-oauth2");
const axios = require("axios");

const getToken = async function(clientId, clientSecret, host, scope) {
  const tokenClient = new ClientCredentials({
    client: {
      id: clientId,
      secret: clientSecret,

    },
    auth: {
      tokenHost: host,
      tokenPath: '/oauth2/token',
      revokePath: '/oauth2/revoke'
    }
  })

  try {
    return tokenClient.getToken({
      scope: scope ?? '',
    })
  } catch (error) {
    console.error('[error] oauthClient::getToken', error.message);

    return null
  }
}

const createClient = async function(clientId, clientSecret, host, scope) {
  let token= await getToken(clientId, clientSecret, host, scope)
  const instance = await axios.create();

  instance.interceptors.request.use(config => {
    if (token.expired()) {
      token = token.refresh()
    }

    config.headers['Authorization'] = `Bearer ${token.token.access_token}`;
    return config;
  });

  return instance
}

exports.createClient = createClient
