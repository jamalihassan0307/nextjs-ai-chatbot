import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from "./config";

let firebaseApp: FirebaseApp;

// Initialize Firebase only if it hasn't been initialized
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApps()[0];
}

// Initialize Firestore and Auth
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);

// Add initialization check
if (!firebaseApp) {
  throw new Error("Firebase failed to initialize!");
}

export { firebaseApp };
