const display = document.querySelector(".calculator-input");
const keys = document.querySelector(".calculator-keys");

let codes = {};
let currentInput = "";

// JSON yükle
fetch("matematik/pi_sayisi.json")
    .then(res => res.json())
    .then(data => {
        codes = data;
    })
    .catch(err => console.log("JSON Yüklenemedi, Easter Egg devre dışı."));

// Butonlara tıklama
keys.addEventListener("click", function (e) {
    const target = e.target;

    // Eğer tıklanan şey bir buton değilse (aradaki boşluklar vs.) işlemi durdur
    if (!target.matches("button")) return;

    const value = target.value;

    // Temizle (AC)
    if (value === "clear") {
        currentInput = "";
        display.value = "";
        return;
    }

    // Tek karakter silme (⌫)
    if (value === "delete") {
        currentInput = currentInput.slice(0, -1);
        display.value = currentInput;
        return;
    }

    // Sonuç hesapla (=)
    if (value === "=") {
        calculate();
        return;
    }

    // Rakam veya Operatör ekle
    currentInput += value;
    display.value = currentInput;
});

function calculate() {
    // 🔥 EASTER EGG KONTROL
    if (codes[currentInput]) {
        window.location.href = "matematik/" + codes[currentInput];
        return;
    }

    try {
        // Matematiksel işlemi hesapla
        if (currentInput !== "") {
            let result = eval(currentInput);
            display.value = result;
            currentInput = result.toString();
        }
    } catch {
        display.value = "Hata";
        currentInput = "";
    }
}
