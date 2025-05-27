const AZKAR_API = "https://raw.githubusercontent.com/nawafalqari/azkar-api/56df51279ab6eb86dc2f6202c7de26c8948331c1/azkar.json";

document.addEventListener("DOMContentLoaded", function() {
    const azkarContent = document.getElementById("azkar-content");
    const nextButton = document.getElementById("next-zekr");
    const prevButton = document.getElementById("prev-zekr");
    
    let azkar = [];
    let currentZekrIndex = 0;

    // تحميل الأذكار
    async function loadAzkar() {
        try {
            const response = await fetch(AZKAR_API);
            const data = await response.json();
            azkar = Object.values(data).flat();
            displayZekr();
        } catch (error) {
            console.error("خطأ في تحميل الأذكار:", error);
            azkarContent.innerHTML = "حدث خطأ في تحميل الأذكار";
        }
    }

    // عرض الذكر الحالي
    function displayZekr() {
        if (azkar.length === 0) return;
        
        const zekr = azkar[currentZekrIndex];
        azkarContent.innerHTML = `
            <p class="zekr-text">${zekr.content}</p>
            <p class="zekr-count">عدد المرات: ${zekr.count}</p>
        `;
    }

    // الانتقال للذكر التالي
    nextButton.addEventListener("click", () => {
        if (currentZekrIndex < azkar.length - 1) {
            currentZekrIndex++;
            displayZekr();
        }
    });

    // الانتقال للذكر السابق
    prevButton.addEventListener("click", () => {
        if (currentZekrIndex > 0) {
            currentZekrIndex--;
            displayZekr();
        }
    });

    loadAzkar();
});