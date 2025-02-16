import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from "./config";

// Initialize Firebase only if it hasn't been initialized
export const firebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0];
export const auth = getAuth(firebaseApp);

// Add initialization check
if (!firebaseApp) {
  console.error("Firebase failed to initialize!");
}
