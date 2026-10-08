import { KJUR } from 'jsrsasign';
import Config from 'react-native-config';


const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';

const FIREBASE_MESSAGING_SCOPE =
  'https://www.googleapis.com/auth/firebase.messaging';

const getEnv = (key: string): string => {
  const value = Config[key];

  if (!value) {
    throw new Error(`${key} is not configured.`);
  }

  return value;
};

export const getFirebaseAccessToken = async (): Promise<string> => {
  const clientEmail = getEnv('FIREBASE_CLIENT_EMAIL');
  const privateKey = getEnv('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n');

  const now = Math.floor(Date.now() / 1000);

  const header = {
    alg: 'RS256',
    typ: 'JWT',
  };

  const payload = {
    iss: clientEmail,
    scope: FIREBASE_MESSAGING_SCOPE,
    aud: GOOGLE_TOKEN_URL,
    iat: now,
    exp: now + 3600,
  };

  const assertion = KJUR.jws.JWS.sign(
    null,
    header,
    payload,
    privateKey,
  );

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body:
      `grant_type=${encodeURIComponent(
        'urn:ietf:params:oauth:grant-type:jwt-bearer',
      )}` +
      `&assertion=${encodeURIComponent(assertion)}`,
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Google OAuth failed (${response.status}): ${responseText}`,
    );
  }

  const data = JSON.parse(responseText);

  if (!data.access_token) {
    throw new Error('Google OAuth response did not contain access_token.');
  }

  return data.access_token;
};