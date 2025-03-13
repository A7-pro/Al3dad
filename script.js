// قائمة المدن وإحداثياتها
const cities = {
    makkah: { name: "مكة", lat: 21.3891, lon: 39.8579 },
    madinah: { name: "المدينة المنورة", lat: 24.4667, lon: 39.6 },
    jeddah: { name: "جدة", lat: 21.2854, lon: 39.2376 },
    riyadh: { name: "الرياض", lat: 24.7136, lon: 46.6753 }
};

// جلب مواقيت الصلاة من API
async function fetchPrayerTimes(cityKey) {
    const city = cities[cityKey];
    const apiURL = `https://api.aladhan.com/v1/timings?latitude=${city.lat}&longitude=${city.lon}&method=4`;

    try {
        const response = await fetch(apiURL);
        const data = await response.json();
        const timings = data.data.timings;

        document.getElementById(`fajr-${cityKey}`).innerText = formatTime(timings.Fajr);
        document.getElementById(`dhuhr-${cityKey}`).innerText = formatTime(timings.Dhuhr);
        document.getElementById(`asr-${cityKey}`).innerText = formatTime(timings.Asr);
        document.getElementById(`maghrib-${cityKey}`).innerText = formatTime(timings.Maghrib);
        document.getElementById(`isha-${cityKey}`).innerText = formatTime(timings.Isha);

        calculateNextPrayer(cityKey, timings);
    } catch (error) {
        console.error(`❌ خطأ في جلب مواقيت الصلاة لـ ${city.name}`, error);
        document.getElementById(`next-prayer-${cityKey}`).innerText = "⚠️ تعذر جلب البيانات";
    }
}

// تحويل الوقت إلى 12 ساعة مع "صباحًا" و"مساءً"
function formatTime(time) {
    let [hours, minutes] = time.split(":").map(Number);
    let suffix = hours >= 12 ? "مساءً" : "صباحًا";
    hours = hours % 12 || 12; // تحويل إلى تنسيق 12 ساعة
    return `${hours}:${minutes < 10 ? "0" + minutes : minutes} ${suffix}`;
}

// حساب أقرب صلاة بالثواني وتحديثها كل ثانية
function calculateNextPrayer(cityKey, timings) {
    const now = new Date();
    const prayerTimes = [
        { name: "الفجر", time: timings.Fajr },
        { name: "الظهر", time: timings.Dhuhr },
        { name: "العصر", time: timings.Asr },
        { name: "المغرب", time: timings.Maghrib },
        { name: "العشاء", time: timings.Isha }
    ];

    let nextPrayer = "❌ غير محدد";
    let nextTimeDiff = Infinity;
    let nextPrayerTime = null;

    prayerTimes.forEach(prayer => {
        const [hours, minutes] = prayer.time.split(":").map(Number);
        const prayerTime = new Date(now);
        prayerTime.setHours(hours, minutes, 0);

        const timeDiff = (prayerTime - now) / 1000; // تحويل الفرق إلى ثواني
        if (timeDiff > 0 && timeDiff < nextTimeDiff) {
            nextTimeDiff = timeDiff;
            nextPrayer = prayer.name;
            nextPrayerTime = prayerTime;
        }
    });

    function updateCountdown() {
        if (!nextPrayerTime) return;
        const now = new Date();
        const timeDiff = (nextPrayerTime - now) / 1000; // تحويل الفرق إلى ثواني

        if (timeDiff <= 0) {
            fetchPrayerTimes(cityKey);
            return;
        }

        const hours = Math.floor(timeDiff / 3600);
        const minutes = Math.floor((timeDiff % 3600) / 60);
        const seconds = Math.floor(timeDiff % 60);

        document.getElementById(`next-prayer-${cityKey}`).innerText = `${nextPrayer} بعد ${hours} ساعة و ${minutes} دقيقة و ${seconds} ثانية`;
    }

    // تحديث العد التنازلي كل ثانية
    setInterval(updateCountdown, 1000);
    updateCountdown();
}

// تحديث مواقيت الصلاة لكل مدينة كل 10 دقائق مع تحديث العد التنازلي كل ثانية
function updateAllCities() {
    Object.keys(cities).forEach(fetchPrayerTimes);
}
updateAllCities();
setInterval(updateAllCities, 600000); // تحديث البيانات كل 10 دقائق