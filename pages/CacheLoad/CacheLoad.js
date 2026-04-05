////////////////////////////////////////////////////////////////////////////////
var phone3 = [];
var fixlen_num  = 9;
var max_numbers = 3;
var lastAppendTime = 0;
var txt_file = "";

// ─── init_Cache ──────────────────────────────────────────────────────────────
function init_Cache() {
    AndroidPath = app.GetPath();
    db = app.OpenDatabase(AndroidPath + "/MyData.db");

    if (!app.FileExists(AndroidPath + "/phone3.txt"))
        app.WriteFile(AndroidPath + "/phone3.txt", "");

    txt_file = AndroidPath + "/phone3.txt";
    return db;
}

// ─── LoadNumber_3  (OnStart dan chaqiriladi) ─────────────────────────────────
function LoadNumber_3() {
    var nums = ReadNumbers();
    phone3[0] = nums[0] || "";
    phone3[1] = nums[1] || "";
    phone3[2] = nums[2] || "";
    window.phone3 = phone3;
    UpdateUICont3();
}

// ─── UpdateUICont3 ────────────────────────────────────────────────────────────────
// • 3 ta input fieldni yangilaydi
// • contact3 buttonlardagi so'nggi 4 raqamni yangilaydi
// • contact3-icon bosilganda ham toggleContact3() orqali chaqiriladi
function UpdateUICont3() {
    var n0 = window.phone3[0] || "";
    var n1 = window.phone3[1] || "";
    var n2 = window.phone3[2] || "";

    document.getElementById("phoneInput").value      = n0;
    document.getElementById("phoneUpdateName").value = n1;
    document.getElementById("phoneUpdateRole").value = n2;

    _setC3Label(0, n0);
    _setC3Label(1, n1);
    _setC3Label(2, n2);
}

function _setC3Label(i, num) {
    var btn = document.getElementById("c3-btn-" + i);
    if (!btn) return;
    btn.textContent = (num && num.length >= 4) ? num.slice(-4) : (num || "----");
}

// ─── UpdateUILoc3 (rezerv) ───────────────────────────────────────────────────
function UpdateUILoc3() {
    // reserved
}

// ─── copyPhone ───────────────────────────────────────────────────────────────
function copyPhone(i) {
    var num = (window.phone3 && window.phone3[i]) || "";
    if (!num) { showToast("Raqam yo'q"); return; }

    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(num).catch(function() { _fallbackCopy(num); });
        } else {
            _fallbackCopy(num);
        }
    } catch(e) { _fallbackCopy(num); }

    showToast("Nusxa olindi: ..." + num.slice(-4));
}

function _fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.cssText = "position:fixed;top:0;left:0;opacity:0;font-size:12px";
    document.body.appendChild(ta);
    ta.focus(); ta.select();
    try { document.execCommand("copy"); } catch(e) {}
    document.body.removeChild(ta);
}

// ─── Panel toggle state ──────────────────────────────────────────────────────
var _loc3Visible     = true;
var _contact3Visible = true;

// ─── toggleLocation3 ─────────────────────────────────────────────────────────
function toggleLocation3() {
    var icon = document.getElementById("location3-icon");
    var btns = document.getElementById("loc3-btns").querySelectorAll("button");

    _loc3Visible = !_loc3Visible;

    if (_loc3Visible) {
        icon.classList.remove("panel-collapsed");
        _animateShow(btns);
    } else {
        icon.classList.add("panel-collapsed");
        _animateHide(btns);
    }
    UpdateUILoc3();
}

// ─── toggleContact3 ──────────────────────────────────────────────────────────
// Ochilganda: phone3 ni qayta yuklaydi → UpdateUICont3() chaqiriladi
function toggleContact3() {
    var icon = document.getElementById("contact3-icon");
    var btns = document.getElementById("contact3-btns").querySelectorAll("button");

    _contact3Visible = !_contact3Visible;

    if (_contact3Visible) {
        icon.classList.remove("panel-collapsed");
        // Raqamlarni qayta yuklash va UI yangilash
        var fresh = ReadNumbers();
        phone3[0] = fresh[0] || "";
        phone3[1] = fresh[1] || "";
        phone3[2] = fresh[2] || "";
        window.phone3 = phone3;
        UpdateUICont3();
        _animateShow(btns);
    } else {
        icon.classList.add("panel-collapsed");
        _animateHide(btns);
    }
}

// ─── Animatsiya: YASHIRISH (o'ngdan chapga, ketma-ket) ───────────────────────
// CSS @keyframes "btnSlideOut" ishlatiladi — faqat "to" qismi bor,
// shuning uchun "from" = elementning hozirgi tabiiy holati (translateX 0, opacity 1).
// animation-fill-mode: both → animatsiya tugagach TO holatida qoladi.
function _animateHide(btns) {
    var DUR     = 220;   // ms, bir buttoning animatsiya davomiyligi
    var STAGGER = 60;    // ms, qo'shni buttonlar orasidagi farq
    var total   = DUR + (btns.length - 1) * STAGGER + 40;

    for (var i = 0; i < btns.length; i++) {
        (function(btn, idx) {
            // O'ng button birinchi ketadi (delay = 0),
            // chap button oxirida ketadi (delay = STAGGER × (n-1))
            var delay = (btns.length - 1 - idx) * STAGGER;
            btn.style.pointerEvents = "none";
            btn.style.animation =
                "btnSlideOut " + DUR + "ms " + delay + "ms ease-in both";
        })(btns[i], i);
    }

    // Animatsiya tamom: visibility:hidden qo'yamiz (joyi saqlanadi, click yo'q)
    //                  animation tozalanadi (hover effekt ishlashi uchun)
    setTimeout(function() {
        for (var i = 0; i < btns.length; i++) {
            btns[i].style.visibility = "hidden";
            btns[i].style.animation  = "";
        }
    }, total);
}

// ─── Animatsiya: KO'RSATISH (chapdan o'ngga, ketma-ket) ─────────────────────
// CSS @keyframes "btnSlideIn" ishlatiladi — faqat "from" qismi bor,
// shuning uchun "to" = elementning tabiiy holati (translateX 0, opacity 1).
// animation-fill-mode: both → animatsiya boshlanishidan oldin FROM holatida turadi
// (ya'ni button hali ham ko'rinmaydi, flash yo'q).
function _animateShow(btns) {
    var DUR     = 260;
    var STAGGER = 60;
    var total   = DUR + (btns.length - 1) * STAGGER + 40;

    for (var i = 0; i < btns.length; i++) {
        (function(btn, idx) {
            // Chap button birinchi keladi (delay = 0),
            // o'ng button oxirida keladi
            var delay = idx * STAGGER;
            btn.style.visibility    = "";           // ko'rsatamiz
            btn.style.pointerEvents = "";
            btn.style.animation =
                "btnSlideIn " + DUR + "ms " + delay + "ms ease-out both";
        })(btns[i], i);
    }

    // Animatsiya tamom: animation tozalanadi (hover effekt ishlashi uchun)
    setTimeout(function() {
        for (var i = 0; i < btns.length; i++) {
            btns[i].style.animation = "";
        }
    }, total);
}

// ─── showToast ───────────────────────────────────────────────────────────────
var _toastTimer = null;
function showToast(msg) {
    var t = document.getElementById("toast");
    if (!t) return;
    t.textContent = msg;
    t.style.display = "block";
    if (_toastTimer) clearTimeout(_toastTimer);
    _toastTimer = setTimeout(function() { t.style.display = "none"; }, 2000);
}

// ─── AppendNumber ────────────────────────────────────────────────────────────
function AppendNumber(num_new) {
    num_new = num_new.toString().padStart(fixlen_num, "0");

    if (num_new.length !== fixlen_num) {
        app.ShowPopup("Raqam uzunligi " + fixlen_num + " bo'lishi kerak");
        return;
    }

    var existing = app.FileExists(txt_file) ? app.ReadFile(txt_file) : "";

    if (existing.includes(num_new)) return;

    var now = Date.now();
    if (now - lastAppendTime < 3000) {
        console.log("Cooldown: 3s ichida boshqa raqam qabul qilinmaydi");
        return;
    }

    existing = num_new + existing;
    var max_len = fixlen_num * max_numbers;
    if (existing.length > max_len) existing = existing.substring(0, max_len);

    app.WriteFile(txt_file, existing);
    lastAppendTime = now;

    window.phone3[0] = num_new;
    UpdateUICont3();
}

// ─── ReadNumbers ─────────────────────────────────────────────────────────────
function ReadNumbers() {
    if (!app.FileExists(txt_file)) return [];
    var data = app.ReadFile(txt_file);
    var nums = [];
    for (var i = 0; i < data.length; i += fixlen_num)
        nums.push(data.substr(i, fixlen_num));
    return nums;
}

// ─── Drawer Dialogs ──────────────────────────────────────────────────────────
var VIL_DIALOG;

function ShowViloyat(name) {
    var data = "";
    if      (name === "FABJ")  data = "FAR,AND,BUX,JIZ";
    else if (name === "XoQoN") data = "XOR,QASH,QORA,NAV";
    else if (name === "SuT")   data = "SAM,SUR,TOSH,SIRD";

    VIL_DIALOG = app.CreateListDialog(name, data);
    VIL_DIALOG.SetOnTouch(Viloyat_OnTouch);
    VIL_DIALOG.Show();
}

function Viloyat_OnTouch(item) {
    app.ShowPopup(item);
    return item;
}