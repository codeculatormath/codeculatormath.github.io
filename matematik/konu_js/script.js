// Sayfa tamamen yüklenene kadar bekle
document.addEventListener("DOMContentLoaded", function() {
    
    const display = document.querySelector(".calculator-input");
    const keys = document.querySelector(".calculator-keys");

    if (!keys || !display) {
        console.error("Hata: HTML sınıfları (.calculator-input veya .calculator-keys) bulunamadı!");
        return;
    }

    let codes = {};
    let currentInput = "";

    // JSON yükle
    fetch("matematik/pi_sayisi.json")
        .then(res => res.json())
        .then(data => {
            codes = data;
        })
        .catch(err => console.log("Easter egg dosyası henüz hazır değil."));

    // Butonlara tıklama
    keys.addEventListener("click", function (e) {
        const target = e.target;
        if (!target.matches("button")) return;

        const value = target.getAttribute("value"); // Değeri güvenli al

        if (value === "clear") {
            currentInput = "";
            display.value = "";
            return;
        }

        if (value === "delete") {
            currentInput = currentInput.slice(0, -1);
            display.value = currentInput;
            return;
        }

        if (value === "=") {
            calculate();
            return;
        }

        currentInput += value;
        display.value = currentInput;
    });

    function calculate() {
        if (codes[currentInput]) {
            window.location.href = "matematik/" + codes[currentInput];
            return;
        }

        try {
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
});
