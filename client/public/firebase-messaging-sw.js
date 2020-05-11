importScripts('https://www.gstatic.com/firebasejs/7.14.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.3/firebase-messaging.js');

var firebaseConfig = {
    apiKey: "AIzaSyCVVlRXx3gRLIs6LiBlWAQuq9UjSUnb5Ms",
    authDomain: "aicte-admin-survey.firebaseapp.com",
    databaseURL: "https://aicte-admin-survey.firebaseio.com",
    projectId: "aicte-admin-survey",
    storageBucket: "aicte-admin-survey.appspot.com",
    messagingSenderId: "738971823337",
    appId: "1:738971823337:web:f529b715d9ab2e84cd1478",
    measurementId: "G-ERH4WKW1ST"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();