import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCQ25xWpYon8edePGEOCiXpcxnhcKopsVg",
    authDomain: "quest-log-52ea5.firebaseapp.com",
    projectId: "quest-log-52ea5",
    storageBucket: "quest-log-52ea5.firebasestorage.app",
    messagingSenderId: "895639710511",
    appId: "1:895639710511:web:76c8921a0e4f2c31314fda"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, getDocs, deleteDoc, doc, updateDoc };