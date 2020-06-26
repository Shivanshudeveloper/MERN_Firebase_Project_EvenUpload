import firebase from "firebase/app";
import "firebase/storage";
import "firebase/database";
import "firebase/auth";
import "firebase/messaging";
import "firebase/analytics";

var firebaseConfig = {
    apiKey: "AIzaSyBSEx2-ykPTb70keLZh3LAuDtQT2VyCsco",
    authDomain: "evencloud-26d32.firebaseapp.com",
    databaseURL: "https://evencloud-26d32.firebaseio.com",
    projectId: "evencloud-26d32",
    storageBucket: "evencloud-26d32.appspot.com",
    messagingSenderId: "599725599274",
    appId: "1:599725599274:web:8f9a716ca577fc72a1f153",
    measurementId: "G-VSJNQ5LYK5"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();


const storage = firebase.storage();
const database = firebase.database();
const auth = firebase.auth();

// Retrieve Firebase Messaging object.
// const messaging = firebase.messaging();
// // Add the public key generated from the console here.
// messaging.usePublicVapidKey("BI1X1xIQoxZ-UMRsXeUHWidzFRu9i9hJy6PdIHkSZLMEZjIDRxZBKZIRxaZI7wvmhSTVUYSK8G_F_YqcOGjdI84");


// Get Instance ID token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
// messaging.getToken().then((currentToken) => {
//     if (currentToken) {
//       console.log(currentToken);
//     } else {
//       // Show permission request.
//       console.log('No Instance ID token available. Request permission to generate one.');
//     }
// }).catch((err) => {
//     console.log('An error occurred while retrieving token. ', err);
// });

// // Callback fired if Instance ID token is updated.
// messaging.onTokenRefresh(() => {
//     messaging.getToken().then((refreshedToken) => {
//       console.log('Token refreshed.');
//       // Indicate that the new Instance ID token has not yet been sent to the
//       // ...
//     }).catch((err) => {
//       console.log('Unable to retrieve refreshed token ', err);
//     });
// });


// Authentication for Google
var googleProvider = new firebase.auth.GoogleAuthProvider();
// Authentication for Facebook
var facebookProvider = new firebase.auth.FacebookAuthProvider();


export {
    auth, googleProvider, facebookProvider, database, storage, firebase as default
}