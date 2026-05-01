const display = document.querySelector(".calculator-input");
const keys = document.querySelector(".calculator-keys");

let codes = {};

// JSON yükle
fetch("matematik/pi_sayisi.json")
  .then(res => res.json())
  .then(data => {
    codes = data;
  });

// input yazma sistemi
let currentInput = "";

// butonlara tıklama
keys.addEventListener("click", function (e) {
  const target = e.target;

  if (!target.matches("button")) return;

  const value = target.value;

  // AC
  if (value === "clear") {
    currentInput = "";
    display.value = "";
    return;
  }

  // =
  if (value === "=") {
    calculate();
    return;
  }

  // normal input
  currentInput += value;
  display.value = currentInput;
});

// hesap + easter egg
function calculate() {

  // 🔥 EASTER EGG KONTROL
  if (codes[currentInput]) {
    window.location.href = "matematik/" + codes[currentInput];
    return;
  }

  try {
    let result = eval(currentInput);
    display.value = result;
    currentInput = result.toString();
  } catch {
    display.value = "Hata";
    currentInput = "";
  }
}
