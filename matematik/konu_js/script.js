document.addEventListener("DOMContentLoaded", function() {
    const display = document.getElementById("display");
    const keys = document.querySelector(".calculator-keys");

    let codes = {};
    fetch("matematik/pi_sayisi.json")
        .then(res => res.json())
        .then(data => { codes = data; });

    // MENÜYÜ KAPATMA FONKSİYONU (Animasyonlu)
    window.closeMenu = function() {
        const menu = document.getElementById("dev-menu");
        if (menu) {
            menu.classList.add("menu-hide");
            setTimeout(() => menu.remove(), 400); // Animasyon bitince kaldır
        }
    }

    function showDevMenu() {
        if(document.getElementById("dev-menu")) return;

        const menu = document.createElement("div");
        menu.id = "dev-menu";
        menu.classList.add("menu-show");
        
        menu.innerHTML = `
            <div class="menu-content">
                <div class="menu-header">
                    <h3>SYSTEM_DEBUG_DUMP_V4.0</h3>
                    <span class="status-blink">RUNNING...</span>
                </div>
                <p>Directory: /root/bin/matematik/</p>
                <div class="asset-grid" id="asset-list"></div>
                <button class="close-btn" onclick="closeMenu()">EXIT_SYSTEM</button>
            </div>
        `;
        document.body.appendChild(menu);

        const list = document.getElementById("asset-list");
        Object.keys(codes).forEach(key => {
            const item = document.createElement("div");
            item.className = "asset-item";
            item.innerHTML = `
                <span class="asset-code">Code: ${key}</span>
                <a href="matematik/${codes[key]}" class="asset-link">Load Module ></a>
            `;
            list.appendChild(item);
        });
    }

    function calculate() {
        let val = display.value;
        
        // ÖZEL PİN: 123456+2
        // Not: Kullanıcı kutuya 123456+2 yazıp Enter'a basarsa tetiklenir.
        if (val === "123456+2" || val === "123458") {
            showDevMenu();
            display.value = "ERR_SYS_EXPLOIT";
            return;
        }

        if (codes[val]) {
            window.location.href = "matematik/" + codes[val];
            return;
        }

        try {
            let sanitized = val.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/,/g, '.');
            display.value = eval(sanitized);
        } catch {
            display.value = "Error";
        }
    }

    // Olay dinleyicileri
    display.addEventListener("keydown", (e) => { if (e.key === "Enter") calculate(); });
    keys.addEventListener("click", (e) => {
        const target = e.target;
        if (!target.matches("button")) return;
        if (target.value === "=") calculate();
        else if (target.value === "clear") display.value = "";
        else display.value += target.value;
    });
});
