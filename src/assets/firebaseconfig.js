import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBVOXerrmwsgc1gFsKP3963jYnAQKEZl-c",
  authDomain: "finalproj-salinity-iot.firebaseapp.com",
  databaseURL: "https://finalproj-salinity-iot-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "finalproj-salinity-iot",
  storageBucket: "finalproj-salinity-iot.firebasestorage.app",
  messagingSenderId: "883507373534",
  appId: "1:883507373534:web:f0599daf18e61a037ca94f"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database }; // Export both the database and auth
