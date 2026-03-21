importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCw57LnP75VOeY_zWRhMPcHAtHXt6aMb2Y",
  authDomain: "cec-sailly-app.firebaseapp.com",
  projectId: "cec-sailly-app",
  storageBucket: "cec-sailly-app.firebasestorage.app",
  messagingSenderId: "441381487733",
  appId: "1:441381487733:web:ddd618581af0959909243c"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const { title, body } = payload.notification;
  self.registration.showNotification(title, {
    body: body,
    icon: '/logo.png'
  });
});
