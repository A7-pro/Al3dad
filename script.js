// ✅ حساب العد التنازلي لشهر رمضان 2026
const ramadanDate = new Date("February 18, 2026 00:00:00").getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const timeLeft = ramadanDate - now;

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    const daysElement = document.getElementById("days");
    const hoursElement = document.getElementById("hours");
    const minutesElement = document.getElementById("minutes");
    const secondsElement = document.getElementById("seconds");

    if (daysElement) daysElement.innerText = days;
    if (hoursElement) hoursElement.innerText = hours;
    if (minutesElement) minutesElement.innerText = minutes;
    if (secondsElement) secondsElement.innerText = seconds;
}

// ✅ تحديث العداد كل ثانية
setInterval(updateCountdown, 1000);
updateCountdown();

// ✅ قائمة المدن المتاحة
const cities = {
    makkah: { name: "Mecca", arabicName: "مكة المكرمة" },
    madinah: { name: "Medina", arabicName: "المدينة المنورة" },
    jeddah: { name: "Jeddah", arabicName: "جدة" },
    riyadh: { name: "Riyadh", arabicName: "الرياض" }
};

// ✅ رابط API لمواقيت الصلاة (تقويم أم القرى)
const apiURL = "https://api.aladhan.com/v1/timingsByCity?city={city}&country=SA&method=4";

// ✅ جلب مواقيت الصلاة لكل مدينة
async function fetchPrayerTimes(cityKey) {
    const city = cities[cityKey].name;
    const url = apiURL.replace("{city}", city);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const timings = data.data.timings;

        // تحديث العناصر فقط إذا كانت موجودة
        updatePrayerTime(`fajr-${cityKey}`, timings.Fajr);
        updatePrayerTime(`dhuhr-${cityKey}`, timings.Dhuhr);
        updatePrayerTime(`asr-${cityKey}`, timings.Asr);
        updatePrayerTime(`maghrib-${cityKey}`, timings.Maghrib);
        updatePrayerTime(`isha-${cityKey}`, timings.Isha);

        // حساب وتحديث الصلاة القادمة
        calculateNextPrayer(cityKey, timings);
    } catch (error) {
        console.error(`❌ خطأ في جلب مواقيت الصلاة لـ ${cities[cityKey].arabicName}:`, error);
        const elements = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].map(prayer => 
            document.getElementById(`${prayer}-${cityKey}`)
        );
        elements.forEach(element => {
            if (element) element.innerText = "⚠️ تعذر جلب البيانات";
        });
    }
}

// ✅ تحديث وقت الصلاة في العنصر المحدد
function updatePrayerTime(elementId, time) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerText = formatTime(time);
    }
}

// ✅ تحويل الوقت إلى تنسيق 12 ساعة مع "صباحًا" و"مساءً"
function formatTime(time) {
    if (!time) return "⚠️ غير متوفر";
    
    let [hours, minutes] = time.split(":").map(Number);
    let suffix = hours >= 12 ? "مساءً" : "صباحًا";
    hours = hours % 12 || 12;
    return `${hours}:${minutes < 10 ? "0" + minutes : minutes} ${suffix}`;
}

// ✅ حساب أقرب صلاة وعرضها
function calculateNextPrayer(cityKey, timings) {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    const prayers = [
        { name: "الفجر", time: timings.Fajr },
        { name: "الظهر", time: timings.Dhuhr },
        { name: "العصر", time: timings.Asr },
        { name: "المغرب", time: timings.Maghrib },
        { name: "العشاء", time: timings.Isha }
    ];

    let nextPrayer = null;
    let minDiff = Infinity;

    prayers.forEach(prayer => {
        const [prayerHour, prayerMinute] = prayer.time.split(":").map(Number);
        const prayerTime = prayerHour * 60 + prayerMinute;
        
        let diff = prayerTime - currentTime;
        if (diff < 0) diff += 24 * 60; // إذا كان الوقت قد مر، أضف 24 ساعة
        
        if (diff < minDiff) {
            minDiff = diff;
            nextPrayer = {
                name: prayer.name,
                hours: Math.floor(diff / 60),
                minutes: diff % 60
            };
        }
    });

    const nextPrayerElement = document.getElementById(`next-prayer-${cityKey}`);
    if (nextPrayerElement && nextPrayer) {
        nextPrayerElement.innerText = `${nextPrayer.name} بعد ${nextPrayer.hours} ساعة و ${nextPrayer.minutes} دقيقة`;
    }
}

// ✅ تحديث مواقيت الصلاة كل دقيقة
function updateAllPrayerTimes() {
    Object.keys(cities).forEach(cityKey => {
        const currentPath = window.location.pathname;
        const cityPage = currentPath.includes(cityKey);
        if (cityPage || currentPath === "/" || currentPath.endsWith("index.html")) {
            fetchPrayerTimes(cityKey);
        }
    });
}

// التحديث الأولي ثم كل دقيقة
updateAllPrayerTimes();
setInterval(updateAllPrayerTimes, 60000);