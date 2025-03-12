// تحديد تاريخ بداية رمضان لعام 2026
const ramadanDate = new Date("February 18, 2026 00:00:00").getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const timeLeft = ramadanDate - now;

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = days;
    document.getElementById("hours").innerText = hours;
    document.getElementById("minutes").innerText = minutes;
    document.getElementById("seconds").innerText = seconds;
}

// تحديث العداد كل ثانية
setInterval(updateCountdown, 1000);
updateCountdown();

// قائمة المدن
const cities = {
    makkah: "Mecca",
    madinah: "Medina",
    jeddah: "Jeddah",
    riyadh: "Riyadh"
};

// استخدام تقويم أم القرى
const apiURL = "https://api.aladhan.com/v1/timingsByCity?city={city}&country=SA&method=4";

async function fetchPrayerTimes(cityKey) {
    const city = cities[cityKey];
    const url = apiURL.replace("{city}", city);

    try {
        const response = await fetch(url);
        const data = await response.json();
        const timings = data.data.timings;

        document.getElementById(`fajr-${cityKey}`).innerText = formatTime(timings.Fajr);
        document.getElementById(`dhuhr-${cityKey}`).innerText = formatTime(timings.Dhuhr);
        document.getElementById(`asr-${cityKey}`).innerText = formatTime(timings.Asr);
        document.getElementById(`maghrib-${cityKey}`).innerText = formatTime(timings.Maghrib);
        document.getElementById(`isha-${cityKey}`).innerText = formatTime(timings.Isha);

        // حساب أقرب صلاة
        calculateNextPrayer(cityKey, timings);
    } catch (error) {
        console.error(`❌ خطأ في جلب مواقيت الصلاة لـ ${cityKey}`, error);
        document.getElementById(`next-prayer-${cityKey}`).innerText = "⚠️ تعذر جلب البيانات";
    }
}

// تحويل الوقت إلى 24 ساعة مع "صباحًا" و"مساءً"
function formatTime(time) {
    let [hours, minutes] = time.split(":").map(Number);
    let suffix = hours >= 12 ? "مساءً" : "صباحًا";
    hours = hours % 24;
    return `${hours}:${minutes < 10 ? "0" + minutes : minutes} ${suffix}`;
}

// حساب أقرب صلاة بالثواني
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

    prayerTimes.forEach(prayer => {
        const [hours, minutes] = prayer.time.split(":").map(Number);
        const prayerTime = new Date(now);
        prayerTime.setHours(hours, minutes, 0);

        const timeDiff = (prayerTime - now) / 1000;
        if (timeDiff > 0 && timeDiff < nextTimeDiff) {
            nextTimeDiff = timeDiff;
            nextPrayer = `${prayer.name} بعد ${Math.floor(timeDiff / 3600)} ساعة و ${Math.floor((timeDiff % 3600) / 60)} دقيقة و ${Math.floor(timeDiff % 60)} ثانية`;
        }
    });

    document.getElementById(`next-prayer-${cityKey}`).innerText = nextPrayer;
}

// تحديث مواقيت الصلاة تلقائيًا
Object.keys(cities).forEach(fetchPrayerTimes);