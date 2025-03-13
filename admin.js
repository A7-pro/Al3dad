// استيراد Firebase
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, get } from "firebase/database";

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

// تسجيل الدخول
document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const devName = document.getElementById("developer-name").value;
    const devCode = document.getElementById("developer-code").value;

    if (devCode !== "120073") {
        alert("❌ كود المطور غير صحيح!");
        return;
    }

    document.getElementById("login-form").style.display = "none";
    document.getElementById("admin-panel").style.display = "block";

    // التأكد من عدم تكرار اسم المطور
    const devsRef = ref(database, "developers");
    get(devsRef).then(snapshot => {
        if (!snapshot.exists() || !Object.values(snapshot.val()).includes(devName)) {
            push(devsRef, devName);
        }
    });
});

// إضافة ذكر جديد
document.getElementById("admin-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const zikrName = document.getElementById("zikr-name").value;
    const zikrText = document.getElementById("zikr-text").value;

    const newZikr = {
        name: zikrName,
        text: zikrText,
        timestamp: Date.now()
    };

    push(ref(database, "azkar"), newZikr)
        .then(() => {
            alert("✅ تم إضافة الذكر بنجاح!");
            document.getElementById("admin-form").reset();
        })
        .catch(error => {
            alert("❌ حدث خطأ أثناء الحفظ: " + error.message);
        });
});
