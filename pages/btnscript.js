// --- Drawer Dialogs ---
let VIL_DIALOG;

function ShowViloyat(name) {
    let data = "";
    if (name === "FABJ") data = "FAR,AND,BUX,JIZ";
    else if (name === "XoQoN") data = "XOR,QASH,QORA,NAV";
    else if (name === "SuT") data = "SAM,SUR,TOSH,SIRD";

    VIL_DIALOG = app.CreateListDialog(name, data);
    VIL_DIALOG.SetOnTouch(Viloyat_OnTouch);
    VIL_DIALOG.Show();
}

function Viloyat_OnTouch(item) {
    app.ShowPopup(item);
    return item;
}


/* ─────────────── Number buttons ─────────────── */
// Har bir button uchun to'liq raqam — ekranda faqat oxirgi 4 ta ko'rinadi
const NUMS = {
    green:  "998901234567",
    yellow: "998711112233",
    red:    "998931114455"
};

function copyNum(key) {
    const num = NUMS[key];
    if (navigator.clipboard) {
        navigator.clipboard.writeText(num).catch(() => fallbackCopy(num));
    } else {
        fallbackCopy(num);
    }
    app.ShowPopup("Nusxa olindi: " + num);
}
function fallbackCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity  = "0";
    document.body.appendChild(ta);
    ta.focus(); ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
}

/* ─────────────── Panel animation ─────────────── */
const rowExpanded = { viloyat: true, numbers: true };

/**
 * Toggle a panel row open/closed.
 * @param {string} rowId  - "viloyat" | "numbers"
 */
function toggleRow(rowId) {
    const wrap   = document.getElementById(rowId + "-buttons");
    const handle = document.getElementById(rowId + "-toggle");
    const btns   = Array.from(wrap.querySelectorAll("button"));
    const exp    = rowExpanded[rowId];

    if (exp) {
        /* ── COLLAPSE: buttons fly left one by one (right→left order) ── */
        handle.textContent = "▶";
        const reversed = [...btns].reverse();          // rightmost first
        reversed.forEach((btn, i) => {
            setTimeout(() => {
                btn.style.transition = "transform .28s ease, opacity .28s ease";
                btn.style.transform  = "translateX(-120px)";
                btn.style.opacity    = "0";
            }, i * 70);
        });
        // After animation ends, collapse the container width to 0
        const delay = (btns.length - 1) * 70 + 300;
        setTimeout(() => {
            wrap.style.transition   = "margin-left .15s ease";
            wrap.style.marginLeft   = "0";
            wrap.style.overflow     = "hidden";
            // Freeze buttons at translated pos (no flicker on re-open)
            btns.forEach(btn => { btn.style.transition = "none"; });
        }, delay);

    } else {
        /* ── EXPAND: reset positions, then fly right one by one (left→right) ── */
        handle.textContent = "◀";
        // Instantly place buttons off-screen left (no transition)
        btns.forEach(btn => {
            btn.style.transition = "none";
            btn.style.transform  = "translateX(-120px)";
            btn.style.opacity    = "0";
        });
        // Un-hide container first
        wrap.style.transition = "none";
        wrap.style.marginLeft = "8px";

        // Next frame: animate each button into place left→right
        requestAnimationFrame(() => requestAnimationFrame(() => {
            btns.forEach((btn, i) => {
                setTimeout(() => {
                    btn.style.transition = "transform .28s ease, opacity .28s ease";
                    btn.style.transform  = "translateX(0)";
                    btn.style.opacity    = "1";
                }, i * 70);
            });
        }));
    }

    rowExpanded[rowId] = !exp;
}