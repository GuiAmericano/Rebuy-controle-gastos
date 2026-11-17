import { Platform } from 'react-native';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseConfig, firebaseConfigurado } from './firebaseConfig';

function iniciar() {
  if (!firebaseConfigurado) return { auth: null, db: null };

  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

  let auth;
  if (Platform.OS === 'web') {
    auth = getAuth(app);
  } else {
    try {
      // A função só existe no build nativo. No navegador, getAuth já guarda a sessão.
      const { getReactNativePersistence } = require('firebase/auth');
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    } catch {
      auth = getAuth(app);
    }
  }

  return { auth, db: getFirestore(app) };
}

const firebase = iniciar();

export const auth = firebase.auth;
export const db = firebase.db;
