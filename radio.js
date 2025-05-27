const RADIO_API = "https://data-rosy.vercel.app/radio.json";

document.addEventListener("DOMContentLoaded", function() {
    const radioSelect = document.getElementById("radio-select");
    const radioPlayer = document.getElementById("radio-player");
    
    // تحميل قائمة القراء
    async function loadRadioStations() {
        try {
            const response = await fetch(RADIO_API);
            const data = await response.json();
            
            // Ensure we have an array of stations
            const stations = Array.isArray(data) ? data : data.stations || [];
            
            if (stations.length === 0) {
                throw new Error("لم يتم العثور على محطات إذاعية");
            }
            
            stations.forEach(station => {
                const option = document.createElement("option");
                option.value = station.url;
                option.textContent = station.name;
                radioSelect.appendChild(option);
            });
        } catch (error) {
            console.error("خطأ في تحميل قائمة القراء:", error);
            // Display error message to user
            radioSelect.innerHTML = '<option value="">خطأ في تحميل المحطات</option>';
        }
    }

    // تغيير المحطة
    radioSelect.addEventListener("change", function() {
        const url = this.value;
        if (url) {
            radioPlayer.src = url;
            radioPlayer.play();
        }
    });

    loadRadioStations();
});