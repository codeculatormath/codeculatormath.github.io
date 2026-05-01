document.addEventListener("DOMContentLoaded", function() {
    const display = document.getElementById("display");
    const keys = document.querySelector(".calculator-keys");
    const html = document.documentElement;

    let codes = {};
    fetch("matematik/pi_sayisi.json")
        .then(res => res.json())
        .then(data => { codes = data; })
        .catch(() => console.log("System files not found."));

    // TEMA KONTROLÜ
    window.toggleTheme = function() {
        const current = html.getAttribute("data-theme");
        const next = current === "dark" ? "light" : "dark";
        html.setAttribute("data-theme", next);
        document.getElementById("theme-icon").innerText = next === "dark" ? "🌙" : "☀️";
    };

    // MENÜ KAPATMA
    window.closeMenu = function() {
        const menu = document.getElementById("dev-menu");
        if (menu) {
            menu.classList.add("menu-hide");
            setTimeout(() => menu.remove(), 400);
        }
    };

    function showDevMenu() {
        if(document.getElementById("dev-menu")) return;
        const menu = document.createElement("div");
        menu.id = "dev-menu";
        menu.classList.add("menu-show");
        
        let assetHTML = "";
        Object.keys(codes).forEach(key => {
            assetHTML += `
                <div class="asset-item">
                    <span class="asset-tag">[LOCAL_FILE]</span>
                    <span class="asset-info">Code: ${key} -> /matematik/${codes[key]}</span>
                </div>`;
        });

        menu.innerHTML = `
            <div class="menu-content">
                <div class="menu-header">
                    <h3>SYSTEM_CORE_DUMP v4.0</h3>
                    <span class="blink">● ACTIVE</span>
                </div>
                <div class="asset-grid">${assetHTML}</div>
                <div class="menu-footer">
                    <button class="exit-btn" onclick="closeMenu()">TERMINATE_SESSION</button>
                </div>
            </div>
        `;
        document.body.appendChild(menu);
    }

    function calculate() {
        let val = display.value;
        if (val === "123456+2" || val === "123458") {
            showDevMenu();
            display.value = "INTERNAL_ERROR";
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

    keys.addEventListener("click", (e) => {
        const target = e.target;
        if (!target.matches("button")) return;
        const val = target.value;

        if (val === "=") calculate();
        else if (val === "clear") display.value = "";
        else if (val === "delete") {
            // "delete" kelimesinin yazılmasını engelleyen düzeltme:
            display.value = display.value.slice(0, -1);
        } else {
            display.value += val;
        }
        display.focus();
    });

    display.addEventListener("keydown", (e) => { if (e.key === "Enter") calculate(); });
});
