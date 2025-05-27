const HADITH_API = "https://hadis-api-id.vercel.app/hadith/abu-dawud?page=2&limit=300";

document.addEventListener("DOMContentLoaded", function() {
    const hadithContent = document.getElementById("hadith-content");
    const nextButton = document.getElementById("next-hadith");
    const prevButton = document.getElementById("prev-hadith");
    
    let hadiths = [];
    let currentHadithIndex = 0;

    // تحميل الأحاديث
    async function loadHadiths() {
        try {
            const response = await fetch(HADITH_API);
            const data = await response.json();
            hadiths = data.items;
            displayHadith();
        } catch (error) {
            console.error("خطأ في تحميل الأحاديث:", error);
            hadithContent.innerHTML = "حدث خطأ في تحميل الأحاديث";
        }
    }

    // عرض الحديث الحالي
    function displayHadith() {
        if (hadiths.length === 0) return;
        
        const hadith = hadiths[currentHadithIndex];
        hadithContent.innerHTML = `
            <p class="hadith-text">${hadith.arab}</p>
            <p class="hadith-number">حديث رقم: ${hadith.number}</p>
        `;
    }

    // الانتقال للحديث التالي
    nextButton.addEventListener("click", () => {
        if (currentHadithIndex < hadiths.length - 1) {
            currentHadithIndex++;
            displayHadith();
        }
    });

    // الانتقال للحديث السابق
    prevButton.addEventListener("click", () => {
        if (currentHadithIndex > 0) {
            currentHadithIndex--;
            displayHadith();
        }
    });

    loadHadiths();
});