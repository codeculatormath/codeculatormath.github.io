let display = document.getElementById("display");
let codes = {};

// JSON dosyasını yükle
fetch("matematik/pi_sayisi.json")
  .then(res => res.json())
  .then(data => {
    codes = data;
  })
  .catch(err => {
    console.log("JSON yüklenemedi:", err);
  });

// ekrana yazma
function add(val) {
  display.value += val;
}

// temizleme
function clearDisplay() {
  display.value = "";
}

// hesaplama + easter egg kontrol
function calc() {
  let input = display.value.trim();

  // 🔥 EASTER EGG KONTROL
  if (codes[input]) {
    // ilgili HTML sayfasına yönlendir
    window.location.href = "matematik/" + codes[input];
    return;
  }

  // normal hesap makinesi
  try {
    display.value = eval(input);
  } catch {
    display.value = "Hata";
  }
}
