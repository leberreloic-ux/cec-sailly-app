import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "cec-sailly-app.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: "cec-sailly-app.firebasestorage.app",
  messagingSenderId: "441381487733",
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const messaging = getMessaging(app);

export const requestNotifPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: process.env.REACT_APP_VAPID_KEY
      });
      return token;
    }
  } catch(e) {
    console.log("Notif non supportées", e);
  }
  return null;
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => resolve(payload));
  });

export const addNews = (item) => addDoc(collection(db, "news"), item);
export const deleteNews = (id) => deleteDoc(doc(db, "news", id));
export const addEvent = (item) => addDoc(collection(db, "events"), item);
export const deleteEvent = (id) => deleteDoc(doc(db, "events", id));

export { onSnapshot, collection, query, orderBy };
