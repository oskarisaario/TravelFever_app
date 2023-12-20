// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "travelfever-6b35e.firebaseapp.com",
  projectId: "travelfever-6b35e",
  storageBucket: "travelfever-6b35e.appspot.com",
  messagingSenderId: "448858989606",
  appId: "1:448858989606:web:f8c01365ed7fa39b8d72e7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);






//ADD EXPORT  TO LINE 17
//HIDE API_KEY. When using .env in vite your must put VITE at the start of the name of secret.