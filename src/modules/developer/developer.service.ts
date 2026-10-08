import { fetchDeveloperEmails } from '../../services/firebase/remoteConfig';
import {getFirebaseAccessToken} from './googleAuth.service';
import Config from 'react-native-config';

const getProjectId = (): string => {

    const projectId = Config.FIREBASE_PROJECT_ID;

  if (!projectId) {
    throw new Error('FIREBASE_PROJECT_ID is not configured.');
  }

  return projectId;
};

export type TriggerPushPayload = {
  token: string;
  title: string;
  body: string;
  deeplink: string;
  id: string;
};

export const triggerTestPush = async ({
  token,
  title,
  body,
  deeplink,
  id,
}: TriggerPushPayload): Promise<string> => {
  if (!token) {
    throw new Error('FCM registration token is missing.');
  }

  const projectId = getProjectId();

  // Generate a fresh OAuth token.
  const accessToken = await getFirebaseAccessToken();

  const url =
    `https://fcm.googleapis.com/v1/projects/` +
    `${projectId}/messages:send`;

  const response = await fetch(url, {
    method: 'POST',

    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({
      message: {
        token,

        notification: {
          title,
          body,
        },

        data: {
          deeplink,
          id,
        },

        android: {
          priority: 'HIGH',
        },
      },
    }),
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `FCM request failed (${response.status}): ${responseText}`,
    );
  }

  let responseData: {name?: string};

  try {
    responseData = JSON.parse(responseText);
  } catch {
    throw new Error(
      `FCM returned an invalid response: ${responseText}`,
    );
  }

  return responseData.name ?? 'FCM message sent successfully.';
};

export const checkDeveloperAccess = async (
  email: string,
): Promise<boolean> => {

  const developerEmails = await fetchDeveloperEmails();

  const normalizedEmail = email.trim().toLowerCase();

  return developerEmails.includes(normalizedEmail);
};