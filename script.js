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

// جلب مواقيت الصلاة تلقائيًا من API
const cities = {
    makkah: "Mecca",
    madinah: "Medina",
    jeddah: "Jeddah",
    riyadh: "Riyadh"
};

const apiURL = "https://api.aladhan.com/v1/timingsByCity?city={city}&country=SA&method=2";

async function fetchPrayerTimes(cityKey) {
    const city = cities[cityKey];
    const url = apiURL.replace("{city}", city);
    try {
        const response = await fetch(url);
        const data = await response.json();
        document.getElementById(`fajr-${cityKey}`).innerText = data.data.timings.Fajr;
        document.getElementById(`dhuhr-${cityKey}`).innerText = data.data.timings.Dhuhr;
        document.getElementById(`asr-${cityKey}`).innerText = data.data.timings.Asr;
        document.getElementById(`maghrib-${cityKey}`).innerText = data.data.timings.Maghrib;
        document.getElementById(`isha-${cityKey}`).innerText = data.data.timings.Isha;
    } catch (error) {
        console.error(`خطأ في جلب مواقيت الصلاة لـ ${cityKey}`, error);
    }
}

// تحديث مواقيت الصلاة تلقائيًا
Object.keys(cities).forEach(fetchPrayerTimes);
