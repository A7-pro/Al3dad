// 🔹 تحديد تاريخ بداية رمضان 2026
const ramadanDate = new Date("February 18, 2026 00:00:00").getTime();

// 🔹 تحديث العداد التنازلي لرمضان
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

// 🔹 المدن المتاحة
const cities = {
    makkah: "Mecca",
    madinah: "Medina",
    jeddah: "Jeddah",
    riyadh: "Riyadh"
};

// 🔹 رابط API لمواقيت الصلاة باستخدام تقويم أم القرى
const apiBaseURL = "https://api.aladhan.com/v1/timingsByCity?city={city}&country=SA&method=4";

// 🔹 جلب مواقيت الصلاة وتحديثها
async function fetchPrayerTimes(cityKey) {
    const city = cities[cityKey];
    const url = apiBaseURL.replace("{city}", city);

    try {
        const response = await fetch(url);
        const data = await response.json();
        const timings = data.data.timings;

        document.getElementById(`fajr`).innerText = formatTime(timings.Fajr);
        document.getElementById(`dhuhr`).innerText = formatTime(timings.Dhuhr);
        document.getElementById(`asr`).innerText = formatTime(timings.Asr);
        document.getElementById(`maghrib`).innerText = formatTime(timings.Maghrib);
        document.getElementById(`isha`).innerText = formatTime(timings.Isha);

    } catch (error) {
        console.error(`❌ خطأ في جلب مواقيت الصلاة لـ ${cityKey}`, error);
    }
}

// 🔹 تحويل الوقت إلى 12 ساعة
function formatTime(time) {
    let [hours, minutes] = time.split(":").map(Number);
    let suffix = hours >= 12 ? "مساءً" : "صباحًا";
    hours = hours % 12 || 12;
    return `${hours}:${minutes < 10 ? "0" + minutes : minutes} ${suffix}`;
}

// 🔹 تحديث مواقيت الصلاة لكل مدينة
document.addEventListener("DOMContentLoaded", function () {
    let cityKey = document.body.dataset.city;
    if (cityKey && cities[cityKey]) {
        fetchPrayerTimes(cityKey);
    }
});