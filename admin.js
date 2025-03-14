// استيراد إعدادات Firebase
import { database } from "./firebase-config.js";
import { ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

document.addEventListener("DOMContentLoaded", function () {
    const adminPanel = document.getElementById("admin-panel");
    const loginSection = document.getElementById("admin-login");
    const loginError = document.getElementById("login-error");
    const adminCodeInput = document.getElementById("admin-code");
    const correctAdminCode = "120073"; // كود الأدمن الصحيح

    // تسجيل دخول الأدمن
    window.loginAdmin = function () {
        if (adminCodeInput.value === correctAdminCode) {
            loginSection.style.display = "none";
            adminPanel.style.display = "block";
            fetchAzkar();
        } else {
            loginError.innerText = "❌ كود الأدمن غير صحيح!";
        }
    };

    // جلب قائمة الأذكار من Firebase
    const azkarContainer = document.getElementById("admin-azkar-list");

    function fetchAzkar() {
        const azkarRef = ref(database, "azkar");

        onValue(azkarRef, (snapshot) => {
            azkarContainer.innerHTML = ""; // مسح المحتوى القديم

            if (!snapshot.exists()) {
                azkarContainer.innerHTML = "<p>❌ لا توجد أذكار مضافة بعد.</p>";
                return;
            }

            snapshot.forEach(childSnapshot => {
                const zekr = childSnapshot.val();
                const zekrCard = document.createElement("div");
                zekrCard.classList.add("azkar-card");
                zekrCard.innerHTML = `<h3>${zekr.title}</h3><p>${zekr.content}</p>`;
                azkarContainer.appendChild(zekrCard);
            });
        }, (error) => {
            console.error("❌ خطأ أثناء تحميل الأذكار:", error);
            azkarContainer.innerHTML = "<p>⚠️ حدث خطأ أثناء تحميل الأذكار.</p>";
        });
    }

    // إضافة ذكر جديد إلى Firebase
    document.getElementById("add-zekr-form").addEventListener("submit", function (event) {
        event.preventDefault();

        const newZekr = {
            title: document.getElementById("zekr-title").value,
            content: document.getElementById("zekr-content").value,
            category: document.getElementById("zekr-category").value
        };

        const newZekrRef = push(ref(database, "azkar"));
        set(newZekrRef, newZekr).then(() => {
            alert("✅ تم إضافة الذكر بنجاح!");
            fetchAzkar(); // تحديث القائمة بعد الإضافة
        }).catch(error => {
            console.error("❌ خطأ أثناء الإضافة:", error);
            alert("⚠️ حدث خطأ أثناء إضافة الذكر!");
        });

        // إعادة تعيين الحقول بعد الإضافة
        document.getElementById("zekr-title").value = "";
        document.getElementById("zekr-content").value = "";
        document.getElementById("zekr-category").value = "";
    });
});