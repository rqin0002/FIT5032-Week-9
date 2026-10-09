// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB02b9MveXGa_3m4E2VgJKGF76bz4gN0dI",
  authDomain: "fit5032-7b50f.firebaseapp.com",
  projectId: "fit5032-7b50f",
  storageBucket: "fit5032-7b50f.firebasestorage.app",
  messagingSenderId: "308362338146",
  appId: "1:308362338146:web:e52f8593e4ab0ae76cd63b"
};

//Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore();
export { db }
