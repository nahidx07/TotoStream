// firebase-config.js
const firebaseConfig = {
    apiKey: "AIzaSyCn72TD-I1yI6-7oCCGlx1Mudh_ZlT7138",
    authDomain: "totostream.firebaseapp.com",
    projectId: "totostream",
    storageBucket: "totostream.firebasestorage.app",
    messagingSenderId: "22142190592",
    appId: "1:22142190592:web:e937438ca67f37cbbcc4e5"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
