import {
  getAuth,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from '@react-native-firebase/auth';

export const signIn = async (
  email: string,
  password: string,
) => {
  return signInWithEmailAndPassword(
    getAuth(),
    email.trim(),
    password,
  );
};

export const signOut = async () => {
  await firebaseSignOut(getAuth());
};