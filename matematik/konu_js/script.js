document.addEventListener("DOMContentLoaded", function() {
    const display = document.getElementById("display");
    const keys = document.querySelector(".calculator-keys");
    const calcScreen = document.getElementById("calc-screen");
    const gameScreen = document.getElementById("game-screen");
    const gameFrame = document.getElementById("game-frame");

    let codes = {};

    // JSON ÇEKME - En sağlam yol
    fetch("../pi_sayisi.json") // script.js konu_js içinde olduğu için ../ ile matematik klasörüne çıkar
        .then(res => {
            if (!res.ok) throw new Error("JSON Bulunamadı");
            return res.json();
        })
        .then(data => { 
            codes = data; 
            console.log("Sistem hazır.");
        })
        .catch(err => {
            // Alternatif yol (Eğer üstteki klasör yapısı tutmazsa)
            fetch("matematik/pi_sayisi.json")
                .then(res => res.json())
                .then(data => { codes = data; });
        });

    function calculate() {
        let val = display.value;

        // 1. GİZLİ MENÜ (Geliştirici Seçeneği)
        if (val === "123456+2" || val === "123458") {
            display.value = "INTERNAL_ERROR";
            // İstersen buraya showDevMenu() fonksiyonunu geri ekleyebilirsin
            return;
        }

        // 2. JSON KOD KONTROLÜ (HTML Arası Geçiş)
        if (codes[val]) {
            // [object Object] hatasını önlemek için .file ekliyoruz
            let targetFile = codes[val].file; 

            calcScreen.style.display = "none"; 
            gameScreen.style.display = "block";
            gameFrame.src = targetFile; // index.html'e göre yol alır
            
            display.value = "";
            return;
        }

        // 3. NORMAL HESAPLAMA
        try {
            let sanitized = val.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
            display.value = eval(sanitized);
        } catch {
            display.value = "Error";
        }
    }

    // BUTON OLAYLARI
    keys.addEventListener("click", (e) => {
        const target = e.target;
        if (!target.matches("button")) return;
        const val = target.value;

        if (val === "=") {
            calculate();
        } else if (val === "clear") {
            display.value = "";
        } else if (val === "delete") {
            display.value = display.value.slice(0, -1);
        } else {
            display.value += val;
        }
        display.focus();
    });

    // ESC İLE GERİ DÖNÜŞ
    document.addEventListener("keydown", function(e) {
        if (e.key === "Escape") {
            gameScreen.style.display = "none";
            calcScreen.style.display = "flex";
            gameFrame.src = ""; 
        }
    });
});
