import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyCafzBQR1r_56oRBlfWukiPSg8rLsHO2Rc",
  authDomain: "nyxhotelcancun.firebaseapp.com",
  projectId: "nyxhotelcancun",
  storageBucket: "nyxhotelcancun.firebasestorage.app",
  messagingSenderId: "107057726714",
  appId: "1:107057726714:web:8da9a356502b024c32b543"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
