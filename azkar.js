// استيراد إعدادات Firebase
import { database } from "./firebase-config.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

document.addEventListener("DOMContentLoaded", function () {
    const azkarContainer = document.getElementById("azkar-container");

    function fetchAzkar() {
        const azkarRef = ref(database, "azkar");

        onValue(azkarRef, (snapshot) => {
            azkarContainer.innerHTML = ""; // مسح المحتوى القديم قبل تحميل الجديد

            if (!snapshot.exists()) {
                azkarContainer.innerHTML = "<p>❌ لا توجد أذكار متاحة.</p>";
                return;
            }

            snapshot.forEach(childSnapshot => {
                const zekr = childSnapshot.val();

                // إنشاء عنصر لعرض الذكر
                const zekrCard = document.createElement("div");
                zekrCard.classList.add("azkar-card");

                const title = document.createElement("h3");
                title.innerText = zekr.title;

                const content = document.createElement("p");
                content.innerText = zekr.content;

                zekrCard.appendChild(title);
                zekrCard.appendChild(content);
                azkarContainer.appendChild(zekrCard);
            });
        }, (error) => {
            console.error("❌ خطأ أثناء تحميل الأذكار:", error);
            azkarContainer.innerHTML = "<p>⚠️ حدث خطأ أثناء تحميل الأذكار.</p>";
        });
    }

    fetchAzkar();
});