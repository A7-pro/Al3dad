document.addEventListener("DOMContentLoaded", function () {
    const adminPanel = document.getElementById("admin-panel");
    const loginSection = document.getElementById("admin-login");
    const loginError = document.getElementById("login-error");
    const adminNameInput = document.getElementById("admin-name");
    const adminCodeInput = document.getElementById("admin-code");

    const correctAdminCode = "120073"; // الكود السري للأدمن

    // وظيفة تسجيل الدخول
    window.loginAdmin = function () {
        if (adminCodeInput.value === correctAdminCode) {
            loginSection.style.display = "none";
            adminPanel.style.display = "block";
        } else {
            loginError.innerText = "❌ كود الأدمن غير صحيح!";
        }
    };

    // جلب قائمة الأذكار من Firebase
    const azkarContainer = document.getElementById("admin-azkar-list");

    async function fetchAzkar() {
        try {
            const response = await fetch("https://raw.githubusercontent.com/A7-pro/Al3dadbot/main/azkar.json");
            const azkar = await response.json();
            azkarContainer.innerHTML = "";

            azkar.forEach(zekr => {
                const zekrCard = document.createElement("div");
                zekrCard.classList.add("azkar-card");
                zekrCard.innerHTML = `<h3>${zekr.title}</h3><p>${zekr.content}</p>`;
                azkarContainer.appendChild(zekrCard);
            });
        } catch (error) {
            console.error("❌ خطأ أثناء تحميل الأذكار:", error);
        }
    }

    fetchAzkar();

    // إضافة ذكر جديد
    document.getElementById("add-zekr-form").addEventListener("submit", async function (event) {
        event.preventDefault();

        const newZekr = {
            title: document.getElementById("zekr-title").value,
            content: document.getElementById("zekr-content").value,
            category: document.getElementById("zekr-category").value
        };

        // إرسال البيانات إلى Firebase أو GitHub JSON
        console.log("🔹 تمت إضافة الذكر بنجاح:", newZekr);
        alert("✅ تم إضافة الذكر بنجاح!");
    });
});