import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "top-chain-357111.firebaseapp.com",
  projectId: "top-chain-357111",
  storageBucket: "top-chain-357111.appspot.com",
  messagingSenderId: "224285536915",
  appId: "1:224285536915:web:e33521fca6fba04a5f1366",
  measurementId: "G-Z23HG7PP07",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)
export const storage = getStorage(app);