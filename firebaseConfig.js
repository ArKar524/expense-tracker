// firebaseConfig.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6Qm2yxh63S2XND6KZMhoarmoztX-ZiUI",
  authDomain: "dot-balance-ccb41.firebaseapp.com",
  projectId: "dot-balance-ccb41",
  storageBucket: "dot-balance-ccb41.firebasestorage.app",
  messagingSenderId: "944144806007",
  appId: "1:944144806007:web:4b699803bb975412fed672",
  measurementId: "G-JXN26W5FJZ",
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { app, auth };
