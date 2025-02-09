// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB-hiyiJrEl5FxAzxy7c3pXBrg1LjFLTYc",
    authDomain: "personal-dfd21.firebaseapp.com",
    projectId: "personal-dfd21",
    storageBucket: "personal-dfd21.firebasestorage.app",
    messagingSenderId: "447144136912",
    appId: "1:447144136912:web:5f26552c9587779746ced5",
    measurementId: "G-F6LCWREP0R"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, doc, setDoc, getDoc };


// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// // const analytics = getAnalytics(app);

// // Initialize Firestore
// export const dbFirestore = getFirestore(app);