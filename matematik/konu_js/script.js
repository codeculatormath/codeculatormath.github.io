document.addEventListener("DOMContentLoaded", function() {
    const display = document.getElementById("display");
    const keys = document.querySelector(".calculator-keys");
    const themeBtn = document.getElementById("theme-btn");
    const html = document.documentElement;

    let codes = {};
    fetch("matematik/pi_sayisi.json").then(res => res.json()).then(data => { codes = data; });

    // GECE - GÜNDÜZ MODU
    themeBtn.addEventListener("click", () => {
        const currentTheme = html.getAttribute("data-theme");
        html.setAttribute("data-theme", currentTheme === "dark" ? "light" : "dark");
    });

    // HESAPLAMA
    function calculate() {
        let val = display.value;
        if (codes[val]) {
            window.location.href = "matematik/" + codes[val];
            return;
        }
        try {
            // Güvenli hesaplama için işaretleri düzeltelim
            let result = eval(val.replace('×', '*').replace('÷', '/').replace('−', '-'));
            display.value = result;
        } catch {
            display.value = "Error";
        }
    }

    // KLAVYE DESTEĞİ
    display.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            calculate();
        }
    });

    // BUTON TIKLAMA
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
        display.focus(); // Tıklayınca yazmaya devam edebilmek için odağı koru
    });
});
