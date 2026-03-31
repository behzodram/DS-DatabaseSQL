// LoadSQL.js

// avval har bir key uchun 1 line edi
// LoadSQLFile v 1.0.3 funksiya ham
// shu nostandart formatdagi SQL faylni 
// o'qishaga mos edi

// yangi format: v 1.0.4
// sql formallanishi mumkin va undagi izoh 
// qismi endi ham kalit sifatida ishlatiladi
// va SQL qatori ham bir nechta line bo'lishi mumkin
// LoadSQLFile funksiyasi ham yangilandi

// LoadSQL.js
// v1.0.6
// Kalit ajratish qoidasi:
//   -- KEY:   → kalit (oxirida ':' bo'lishi SHART)
//   -- izoh   → oddiy comment, o'tkazib yuboriladi
// Yangilik: inline commentlar ham tozalanadi
//   masalan: "phone TEXT, -- izoh" → "phone TEXT,"

// v 1.0.7
// LoadSQLFILE avval 
//      1.app.ReadFile
//      2.app.FileExists
// qilardi, endi esa bu tekshiruvlar tashqarida amalga oshiriladi
// va LoadSQLFile faqat o'qish va parsing bilan shug'ullanadi
// Sababi APK building dan keyin ERROR berar edi shunday qilinmasa

function LoadSQLFile(hasfile, content, callback) {
    
    if (!hasfile) {
        console.log("File not found: " + path);
        if (callback) callback();
        return;
    }
    // var content = app.ReadFile(path);
    content = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

    var lines      = content.split("\n");
    var currentKey = null;
    var currentSQL = [];

    for (var i = 0; i < lines.length; i++) {
        var trimmed = lines[i].trim();

        // Faqat "-- WORD:" shaklida kalit comment
        if (trimmed.match(/^--\s*\w+\s*:/)) {
            if (currentKey !== null && currentSQL.length > 0) {
                queries[currentKey] = currentSQL.join(" ").replace(/\s+/g, " ").trim();
            }
            var colonIdx = trimmed.indexOf(":");
            currentKey = trimmed.substring(2, colonIdx).trim();
            currentSQL = [];

        } else if (trimmed.startsWith("--")) {
            // Qator boshi comment — o'tkazib yuborish
            continue;

        } else if (currentKey !== null && trimmed.length > 0) {
            // Inline commentni kesib tashlash: "TEXT, -- izoh" → "TEXT,"
            var inlineIdx = trimmed.indexOf("--");
            if (inlineIdx !== -1) {
                trimmed = trimmed.substring(0, inlineIdx).trim();
            }
            if (trimmed.length > 0) {
                currentSQL.push(trimmed);
            }
        }
    }

    if (currentKey !== null && currentSQL.length > 0) {
        queries[currentKey] = currentSQL.join(" ").replace(/\s+/g, " ").trim();
    }

    if (callback) callback();
}