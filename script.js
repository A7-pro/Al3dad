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
    madinah: "Medina"
};

const apiURL = "https://api.aladhan.com/v1/timingsByCity?city={city}&country=SA&method=2";

async function fetchPrayerTimes(cityKey) {
    const city = cities[cityKey];
    const url = apiURL.replace("{city}", city);
    try {
        const response = await fetch(url);
        const data = await response.json();
        const timings = data.data.timings;

        document.getElementById(`fajr-${cityKey}`).innerText = timings.Fajr;
        document.getElementById(`dhuhr-${cityKey}`).innerText = timings.Dhuhr;
        document.getElementById(`asr-${cityKey}`).innerText = timings.Asr;
        document.getElementById(`maghrib-${cityKey}`).innerText = timings.Maghrib;
        document.getElementById(`isha-${cityKey}`).innerText = timings.Isha;

        // حساب أقرب صلاة
        const now = new Date();
        const prayerTimes = [
            { name: "الفجر", time: timings.Fajr },
            { name: "الظهر", time: timings.Dhuhr },
            { name: "العصر", time: timings.Asr },
            { name: "المغرب", time: timings.Maghrib },
            { name: "العشاء", time: timings.Isha }
        ];

        let nextPrayer = "غير محدد";
        let nextTimeDiff = Infinity;

        prayerTimes.forEach(prayer => {
            const prayerTime = new Date(now.toDateString() + " " + prayer.time);
            const timeDiff = prayerTime - now;
            if (timeDiff > 0 && timeDiff < nextTimeDiff) {
                nextTimeDiff = timeDiff;
                nextPrayer = `${prayer.name} بعد ${Math.floor(timeDiff / (1000 * 60))} دقيقة`;
            }
        });

        document.getElementById(`next-prayer-${cityKey}`).innerText = nextPrayer;
    } catch (error) {
        console.error(`خطأ في جلب مواقيت الصلاة لـ ${cityKey}`, error);
    }
}

// تحديث مواقيت الصلاة تلقائيًا
Object.keys(cities).forEach(fetchPrayerTimes);