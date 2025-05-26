const { initializeApp } = require("firebase/app");
const {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendEmailVerification,
    sendPasswordResetEmail
} = require("firebase/auth");

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAT4MhP0kIzUCwLHJdKaUGhgdoPVW6n_Uo",
    authDomain: "preordermember.firebaseapp.com",
    projectId: "preordermember",
    storageBucket: "preordermember.appspot.com",
    messagingSenderId: "177339658599",
    appId: "1:177339658599:web:eb9362f283cce4dcd97fc2"
};

// Initialize Firebase
initializeApp(firebaseConfig);

module.exports = {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    sendEmailVerification,
    sendPasswordResetEmail,
};