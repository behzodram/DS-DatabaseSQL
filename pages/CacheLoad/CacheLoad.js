var phone3 = [], file = "demofile";

// Used in pages/pages.js -> inside OnStart
function LoadNumber_3() {
    phone3[0] = ReadNumbers()[0];
    phone3[1] = ReadNumbers()[1];
    phone3[2] = ReadNumbers()[2];

    // app.ReadFile("Cache/phone3.json");
    if( phone3 ) {
        window.phone3 = phone3;
        UpdateUI();
    }
}

// used for update UI of pages/index.html
function UpdateUI() {
    document.getElementById('TEL_NUM').innerText = window.phone3[0];
    document.getElementById('phoneInput').value = window.phone3[0];
    document.getElementById('phoneUpdateName').value = window.phone3[1];
    document.getElementById('phoneUpdateRole').value = window.phone3[2];
}

//////////////////////////////////////////////////////////////////////
var txt_file = "Cache/phone3.txt";  // fayl manzili
var fixlen_num = 9;                  // har raqam uzunligi
var max_numbers = 3;                 // maksimal raqamlar soni

// cooldown tracking
var lastAppendTime = 0;  // millisekund

// 3 raqamli register Cache yozadi oladi
function AppendNumber(num_new) {
    var now = Date.now(); // hozirgi vaqt

    // ❌ 3 sekunddan kam bo'lsa chiqib ket
    if(now - lastAppendTime < 3000) {
        console.log("Cooldown: 3s ichida boshqa raqam qabul qilinmaydi");
        return;
    }

    lastAppendTime = now; // append vaqtini saqlaymiz

    // 1️⃣ Normalize length   
    num_new = num_new.toString().padStart(fixlen_num, "0"); 

    // 2️⃣ Faylni o‘qish
    var existing = "";
    if(app.FileExists(txt_file)) {
        existing = app.ReadFile(txt_file);
    }

    // 3️⃣ Yangi raqamni qo‘shish
    existing = num_new + existing; 

    // 4️⃣ Maksimal uzunlikni saqlash
    var max_len = fixlen_num * max_numbers;
    if(existing.length > max_len) {
        existing = existing.substring(0, max_len);
    }

    // 5️⃣ Faylga yozish
    app.WriteFile(txt_file, existing);

    window.phone3[0] = num_new;
    UpdateUI();
}

// 3 raqamli register Cache oqiydi oladi
// 🔹 O‘qish funksiyasi
function ReadNumbers() {
    if(!app.FileExists(txt_file)) return [];

    var data = app.ReadFile(txt_file);
    app.ShowPopup( "Num Len" + data.length )

    var nums = [];

    for(var i = 0; i < data.length; i += fixlen_num) {
        nums.push(data.substr(i, fixlen_num));
    }

    return nums;
}