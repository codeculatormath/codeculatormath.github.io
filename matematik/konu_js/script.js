document.addEventListener("DOMContentLoaded", function() {
    const display = document.getElementById("display");
    const keys = document.querySelector(".calculator-keys");
    const themeBtn = document.getElementById("theme-btn");
    const html = document.documentElement;

    // Easter Egg verileri
    let codes = {};
    fetch("matematik/pi_sayisi.json")
        .then(res => res.json())
        .then(data => { codes = data; })
        .catch(() => console.log("JSON bulunamadı."));

    // TEMA DEĞİŞTİRME (Gece/Gündüz)
    themeBtn.addEventListener("click", function() {
        const currentTheme = html.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        html.setAttribute("data-theme", newTheme);
    });

    // HESAPLAMA FONKSİYONU
    function calculate() {
        let val = display.value;
        if (!val) return;

        // Easter Egg Kontrol
        if (codes[val]) {
            window.location.href = "matematik/" + codes[val];
            return;
        }

        try {
            // iOS işaretlerini standart operatörlere çevirip hesapla
            let sanitizedVal = val.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/,/g, '.');
            let result = eval(sanitizedVal);
            display.value = result;
        } catch (e) {
            display.value = "Hata";
        }
    }

    // KLAVYE DESTEĞİ (Enter tuşu)
    display.addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            calculate();
        }
    });

    // BUTON TIKLAMA
    keys.addEventListener("click", function(e) {
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
});
