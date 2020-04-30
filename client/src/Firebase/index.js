import firebase from "firebase/app";
import "firebase/storage";
import "firebase/database";

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

const storage = firebase.storage();
const database = firebase.database();

export {
    database, storage, firebase as default
}