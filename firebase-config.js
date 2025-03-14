// استيراد مكتبات Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// إعداد Firebase بمعلومات مشروعك
const firebaseConfig = {
    apiKey: "AIzaSyBM4b-CBBN2ToiNctQNlPCX-NMv_N0yP7c",
    authDomain: "aladad.firebaseapp.com",
    databaseURL: "https://aladad-default-rtdb.firebaseio.com",
    projectId: "aladad",
    storageBucket: "aladad.appspot.com",
    messagingSenderId: "1026855261054",
    appId: "1:1026855261054:web:73b373f6165ae97125d92f"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
