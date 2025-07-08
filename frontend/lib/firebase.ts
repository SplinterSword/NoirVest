import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from "firebase/auth"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Auth
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: "select_account",
})

// Initialize Firestore
export const db = getFirestore(app)

// Only connect to emulators in development and if not already connected
if (process.env.NODE_ENV === "development") {
  try {
    // Check if we're not already connected to avoid errors
    if (!auth.config) {
      connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true })
    }
  } catch (error) {
    // Emulator connection failed or already connected, continue with production
    console.log("Using production Firebase Auth")
  }

  try {
    // Check if we're not already connected to avoid errors
    if (!(db as any)._delegate._databaseId.projectId.includes("demo-")) {
      connectFirestoreEmulator(db, "localhost", 8080)
    }
  } catch (error) {
    // Emulator connection failed or already connected, continue with production
    console.log("Using production Firestore")
  }
}
