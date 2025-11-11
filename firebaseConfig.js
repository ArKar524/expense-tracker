// Import the functions you need from the SDKs you need
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAnalytics } from "firebase/analytics";
import { getReactNativePersistence, initializeApp, initializeAuth } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC6Qm2yxh63S2XND6KZMhoarmoztX-ZiUI",
  authDomain: "dot-balance-ccb41.firebaseapp.com",
  projectId: "dot-balance-ccb41",
  storageBucket: "dot-balance-ccb41.firebasestorage.app",
  messagingSenderId: "944144806007",
  appId: "1:944144806007:web:4b699803bb975412fed672",
  measurementId: "G-JXN26W5FJZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const analytics = getAnalytics(app);

export { analytics, app, auth };

