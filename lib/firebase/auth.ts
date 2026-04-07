import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { getAuthInstance, isFirebaseConfigured } from './config';

export async function signUp(email: string, password: string): Promise<User> {
  const auth = getAuthInstance();
  if (!auth) throw new Error('Firebase is not configured. Add your credentials to .env');
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function signIn(email: string, password: string): Promise<User> {
  const auth = getAuthInstance();
  if (!auth) throw new Error('Firebase is not configured. Add your credentials to .env');
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function signOut(): Promise<void> {
  const auth = getAuthInstance();
  if (!auth) return;
  await fbSignOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void) {
  const auth = getAuthInstance();
  if (!auth) {
    // No Firebase — always guest mode
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}
