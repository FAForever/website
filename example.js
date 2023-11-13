// this is only working if you "fix" the java-api with the workaround described in https://github.com/FAForever/website/issues/445#issuecomment-1798194886
// you also need to add the new hydra-client into the db (grant_type=client_credentials and token_endpoint_auth_method=client_secret_basic are the changes)


// INSERT INTO hydra.hydra_client (id, client_name, client_secret, redirect_uris, grant_types, response_types, scope,
//   owner, policy_uri, tos_uri, client_uri, logo_uri, contacts, client_secret_expires_at,
//   sector_identifier_uri, jwks, jwks_uri, request_uris, token_endpoint_auth_method,
//   request_object_signing_alg, userinfo_signed_response_alg, subject_type,
//   allowed_cors_origins, audience, created_at, updated_at, frontchannel_logout_uri,
//   frontchannel_logout_session_required, post_logout_redirect_uris, backchannel_logout_uri,
//   backchannel_logout_session_required, metadata, token_endpoint_auth_signing_alg,
//   authorization_code_grant_access_token_lifespan,
//   authorization_code_grant_id_token_lifespan,
//   authorization_code_grant_refresh_token_lifespan,
//   client_credentials_grant_access_token_lifespan, implicit_grant_access_token_lifespan,
//   implicit_grant_id_token_lifespan, jwt_bearer_grant_access_token_lifespan,
//   password_grant_access_token_lifespan, password_grant_refresh_token_lifespan,
//   refresh_token_grant_id_token_lifespan, refresh_token_grant_access_token_lifespan,
//   refresh_token_grant_refresh_token_lifespan, registration_access_token_signature)
// VALUES ('faf-website-m2m', 'faforever.com', '$2a$10$uTc3uuPAS2C7rzD0L6TAlOrjaC/oIvA.jAIcezhOGm4SkSuu55GqC', '',
//   'client_credentials', 'code', '', '100', '', '', '', 'https://faforever.com/images/faf-logo.png', '', 0, '',
//   '{}', '', '', 'client_secret_basic', '', 'none', 'public', '', '', '2023-10-27 09:29:17', '2023-10-27 09:29:17',
//   '', 0, '', '', 0, '{}', '', null, null, null, null, null, null, null, null, null, null, null, null,
//   'LXDpX3iDiLBFU3LlJzogCPEoF3HiPkD02BZQC-e1cOc');

// this is how the result should look like:
// root@fdc4cb2005f8:/code# node example.js 
// {
//   createTime: '2023-10-27T10:38:46Z',
//     description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr',
//   name: 'Alpha Clan',
//   requiresInvitation: true,
//   tag: 'ALF',
//   tagColor: null,
//   updateTime: '2023-11-04T05:54:52Z',
//   websiteUrl: 'http://localhost:8096/clan/1'
// }

(async function() {
  const {createClient} = require("./lib/OauthClient");
  
  const oauthM2mClientId = 'faf-website-m2m'
  const oauthM2mClientSecret = 'banana'
  const oauthHost = 'http://faf-ory-hydra:4444'
  const scope = ''
  const javaApiHost = 'http://faf-java-api:8010'
  
  try {
    const oauthServerClient = await createClient(oauthM2mClientId, oauthM2mClientSecret, oauthHost, scope)
    const response = await oauthServerClient.get(javaApiHost + '/data/clan')
    let clansResponse = Object.values(response.data);

    console.log(clansResponse[0][0].attributes)
  } catch (e) {
    console.error(e.toString())
  }
})()
