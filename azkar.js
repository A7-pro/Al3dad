document.addEventListener("DOMContentLoaded", function () {
    const azkarContainer = document.getElementById("azkar-container");

    // قائمة الأذكار بصور محلية
    const azkarList = [
        {
            title: "🌙 أذكار الصباح والمساء",
            image: "اذكار الصباح والمساء.png"
        },
        {
            title: "🕌 أذكار بعد الصلاة",
            image: "بعد الصلاة.png"
        }
    ];

    // عرض الأذكار على الصفحة
    azkarContainer.innerHTML = "";
    azkarList.forEach(zekr => {
        const zekrCard = document.createElement("div");
        zekrCard.classList.add("azkar-card");

        const title = document.createElement("h3");
        title.innerText = zekr.title;

        const image = document.createElement("img");
        image.src = zekr.image;
        image.alt = zekr.title;

        zekrCard.appendChild(title);
        zekrCard.appendChild(image);
        azkarContainer.appendChild(zekrCard);
    });
});