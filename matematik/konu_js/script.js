document.addEventListener("DOMContentLoaded", function() {
    const display = document.getElementById("display");
    const keys = document.querySelector(".calculator-keys");

    let codes = {};
    fetch("matematik/pi_sayisi.json")
        .then(res => res.json())
        .then(data => { codes = data; });

    function showDevMenu() {
        if(document.getElementById("dev-menu")) return;
        const menu = document.createElement("div");
        menu.id = "dev-menu";
        menu.classList.add("menu-show");
        
        let assets = "";
        Object.keys(codes).forEach(key => {
            assets += `<div class="asset-item">[LOCAL_FILE] Code: ${key} -> /matematik/${codes[key]}</div>`;
        });

        menu.innerHTML = `
            <div class="menu-content">
                <div class="menu-header">SYSTEM_CORE_DUMP v4.0</div>
                <div class="asset-grid">${assets}</div>
                <button class="exit-btn" onclick="this.parentElement.parentElement.remove()">TERMINATE_SESSION</button>
            </div>`;
        document.body.appendChild(menu);
    }

    keys.addEventListener("click", (e) => {
        const target = e.target;
        if (!target.matches("button")) return;

        const val = target.value;

        // 1. Eşittir Kontrolü
        if (val === "=") {
            if (display.value === "123456+2" || display.value === "123458") {
                showDevMenu();
                display.value = "INTERNAL_ERROR";
            } else if (codes[display.value]) {
                window.location.href = "matematik/" + codes[display.value];
            } else {
                try {
                    let sanitized = display.value.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
                    display.value = eval(sanitized);
                } catch { display.value = "Error"; }
            }
        } 
        // 2. Temizleme
        else if (val === "clear") {
            display.value = "";
        } 
        // 3. SİLME (Burada display.value += val çalışmaz, o yüzden "delete" yazamaz)
        else if (val === "delete") {
            display.value = display.value.slice(0, -1);
        } 
        // 4. Sayılar ve Diğerleri
        else {
            display.value += val;
        }
        display.focus();
    });
});
