// استيراد Firebase
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBM4b-CBBN2ToiNctQNlPCX-NMv_N0yP7c",
  authDomain: "aladad.firebaseapp.com",
  databaseURL: "https://aladad-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "aladad",
  storageBucket: "aladad.firebasestorage.app",
  messagingSenderId: "1026855261054",
  appId: "1:1026855261054:web:73b373f6165ae97125d92f",
  measurementId: "G-6DEDKFJKMK"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const azkarList = document.getElementById("azkar-list");

onValue(ref(database, "azkar"), (snapshot) => {
    azkarList.innerHTML = "";
    if (snapshot.exists()) {
        const azkarData = snapshot.val();
        Object.values(azkarData).forEach(zikr => {
            const zikrBox = document.createElement("div");
            zikrBox.classList.add("zikr-box");
            zikrBox.innerHTML = `
                <h3>${zikr.name}</h3>
                <p>${zikr.text}</p>
            `;
            azkarList.appendChild(zikrBox);
        });
    } else {
        azkarList.innerHTML = "<p>❌ لا يوجد أذكار مضافة بعد.</p>";
    }
});
