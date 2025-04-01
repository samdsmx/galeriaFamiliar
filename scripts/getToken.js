const { google } = require('googleapis');
const readline = require('readline');

const { clientId, clientSecret, redirectUri } = require('./oauth-config');
const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

const SCOPES = ['https://www.googleapis.com/auth/photoslibrary.readonly'];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
});

console.log('Abre esta URL en tu navegador:\n', authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('\nPega aquí el código que recibiste: ', (code) => {
  rl.close();
  oauth2Client.getToken(code, (err, token) => {
    if (err) return console.error('Error obteniendo el token:', err);
    console.log('\n✅ Guarda este token en token.json:\n');
    console.log(JSON.stringify(token, null, 2));
  });
});
