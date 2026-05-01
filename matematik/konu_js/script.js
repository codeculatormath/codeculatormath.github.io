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
  .catch(err => console.error("JSON Yüklenemedi:", err));

// butonlara tıklama
keys.addEventListener("click", function (e) {
  const target = e.target;
  if (!target.matches("button")) return;

  const value = target.value;

  // AC (Clear)
  if (value === "clear") {
    currentInput = "";
    display.value = "";
    return;
  }

  // Delete (Silme)
  if (value === "delete") {
    currentInput = currentInput.slice(0, -1);
    display.value = currentInput;
    return;
  }

  // Eşittir (=)
  if (value === "=") {
    calculate();
    return;
  }

  // Normal giriş
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
    // eval ile hesapla
    let result = eval(currentInput);
    display.value = result;
    currentInput = result.toString();
  } catch {
    display.value = "Hata";
    currentInput = "";
  }
}
