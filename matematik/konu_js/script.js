document.addEventListener("DOMContentLoaded", function() {
    const display = document.getElementById("display");
    const keys = document.querySelector(".calculator-keys");

    let codes = {};

    // 1. JSON YÜKLEME (Klasör yapına göre ../ ile çıkış yapar)
    fetch("../pi_sayisi.json")
        .then(res => {
            if (!res.ok) throw new Error("JSON bulunamadı!");
            return res.json();
        })
        .then(data => {
            codes = data;
            console.log("Sistem Dosyaları Aktif.");
        })
        .catch(err => {
            // Alternatif yol (Hata payına karşı)
            fetch("matematik/pi_sayisi.json")
                .then(res => res.json())
                .then(data => { codes = data; });
        });

    // Geliştirici Menüsü (showDevMenu)
    function showDevMenu() {
        if(document.getElementById("dev-menu")) return;
        const menu = document.createElement("div");
        menu.id = "dev-menu";
        menu.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:10000;color:#0f0;font-family:monospace;padding:20px;overflow-y:auto;";
        
        let assets = "";
        Object.keys(codes).forEach(key => {
            assets += `<p>> CODE: ${key} | TARGET: ${codes[key].file}</p>`;
        });

        menu.innerHTML = `
            <h2>SYSTEM_CORE_DUMP</h2>
            <hr>${assets}<hr>
            <button onclick="this.parentElement.remove()" style="background:#f00;color:#fff;border:none;padding:10px;cursor:pointer;">TERMINATE_SESSION</button>
        `;
        document.body.appendChild(menu);
    }

    // 2. ANA HESAPLAMA VE YÖNLENDİRME MANTIĞI
    function calculate() {
        let val = display.value;

        // Özel Menü Girişi
        if (val === "123456+2" || val === "123458") {
            showDevMenu();
            display.value = "INTERNAL_ERROR";
            return;
        }

        // JSON Kod Kontrolü (Hatalı olan [object Object] düzeltildi)
        if (codes[val]) {
            // codes[val] bir objedir, bize içindeki .file (string) lazım.
            window.location.href = codes[val].file; 
            return;
        }

        // Normal Matematiksel İşlem
        try {
            let sanitized = val.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/,/g, '.');
            display.value = eval(sanitized);
        } catch {
            display.value = "Error";
        }
    }

    // 3. TIKLAMA OLAYLARI
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

    // 4. KLAVYE DESTEĞİ VE ESC İLE GERİ DÖNÜŞ
    document.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            calculate();
        }
        if (e.key === "Escape") {
            // Eğer bir sayfaya yönlendiyse geri dönmek için (Dosya içi Esc desteği)
            window.location.href = "../../index.html"; 
        }
    });
});
