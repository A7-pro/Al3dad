// القرآن الكريم API
const QURAN_API = "https://api.alquran.cloud/v1/surah/";
const RECITER_API = "https://api.quran.com/api/v4/chapter_recitations/";

document.addEventListener("DOMContentLoaded", function() {
    const surahSelect = document.getElementById("surah-select");
    const reciterSelect = document.getElementById("reciter-select");
    const surahContent = document.getElementById("surah-content");
    const quranPlayer = document.getElementById("quran-player");

    // تحميل قائمة السور
    async function loadSurahs() {
        for (let i = 1; i <= 114; i++) {
            const response = await fetch(`${QURAN_API}${i}`);
            const data = await response.json();
            const option = document.createElement("option");
            option.value = i;
            option.textContent = `${i}. ${data.data.name} - ${data.data.englishName}`;
            surahSelect.appendChild(option);
        }
    }

    // تحميل قائمة القراء
    async function loadReciters() {
        for (let i = 1; i <= 12; i++) {
            const response = await fetch(`${RECITER_API}${i}`);
            const data = await response.json();
            const option = document.createElement("option");
            option.value = i;
            option.textContent = data.reciter_name;
            reciterSelect.appendChild(option);
        }
    }

    // عرض السورة المختارة
    surahSelect.addEventListener("change", async function() {
        const surahNumber = this.value;
        if (!surahNumber) return;

        try {
            const response = await fetch(`${QURAN_API}${surahNumber}`);
            const data = await response.json();
            
            surahContent.innerHTML = data.data.ayahs
                .map(ayah => `<p>${ayah.text} ﴿${ayah.numberInSurah}﴾</p>`)
                .join("");
        } catch (error) {
            console.error("خطأ في تحميل السورة:", error);
            surahContent.innerHTML = "حدث خطأ في تحميل السورة";
        }
    });

    // تشغيل تلاوة القارئ المختار
    reciterSelect.addEventListener("change", async function() {
        const reciterId = this.value;
        const surahNumber = surahSelect.value;
        if (!reciterId || !surahNumber) return;

        try {
            const response = await fetch(`${RECITER_API}${reciterId}`);
            const data = await response.json();
            quranPlayer.src = data.audio_url;
            quranPlayer.play();
        } catch (error) {
            console.error("خطأ في تحميل التلاوة:", error);
        }
    });

    loadSurahs();
    loadReciters();
});