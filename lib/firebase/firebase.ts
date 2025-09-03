
'use client';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  "projectId": "pennypilot-9orgd",
  "appId": "1:192697113978:web:7e1e7c9ab4b731cc128ac3",
  "storageBucket": "pennypilot-9orgd.firebasestorage.app",
  "apiKey": "AIzaSyADvEHTOVSAwyiTkptmUJl2h0_y8HDAWH8",
  "authDomain": "pennypilot-9orgd.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "192697113978"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };
