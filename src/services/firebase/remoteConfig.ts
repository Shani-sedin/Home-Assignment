import {
  fetchAndActivate,
  getRemoteConfig,
  getString,
} from '@react-native-firebase/remote-config';

const DEVELOPER_EMAILS_KEY = 'developer_emails';

export const fetchDeveloperEmails = async (): Promise<string[]> => {
  const config = getRemoteConfig();

  config.settings = {
    minimumFetchIntervalMillis: 0,
    fetchTimeoutMillis: 10000,
  };

  await fetchAndActivate(config);

  const rawValue = getString(config, DEVELOPER_EMAILS_KEY);

  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter(
        (email): email is string =>
          typeof email === 'string',
      )
      .map(email => email.trim().toLowerCase());
  } catch {
    return [];
  }
};