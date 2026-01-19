// --- FIREBASE CONFIGURATION ---
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

let app: FirebaseApp | undefined;
let analytics: Analytics | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

try {
    // Check if config is valid (simple check)
    if (typeof window !== 'undefined' && !getApps().length) {
        if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY_HERE") {
            app = initializeApp(firebaseConfig);
            // Analytics only supported in browser
            isSupported().then(yes => yes ? analytics = getAnalytics(app!) : null);
            auth = getAuth(app);
            db = getFirestore(app);
        } else {
            console.warn("Firebase config missing or invalid. Running in Demo Mode.");
        }
    } else if (getApps().length) {
        app = getApps()[0];
        auth = getAuth(app);
        db = getFirestore(app);
    }
} catch (error) {
    console.error("Firebase initialization error:", error);
}

export { app, analytics, auth, db };
