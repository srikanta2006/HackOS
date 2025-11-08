
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBIyaoL9j2TL3zHWrgW2NgjspBMcGiYAiI",
  authDomain: "hcp-project-3361c.firebaseapp.com",
  projectId: "hcp-project-3361c",
  storageBucket: "hcp-project-3361c.firebasestorage.app",
  messagingSenderId: "487036185182",
  appId: "1:487036185182:web:52f1094a17a9318c03e2cf"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;