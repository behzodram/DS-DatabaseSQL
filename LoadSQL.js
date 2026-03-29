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


function LoadSQLFile(path, callback) {
    var content = app.ReadFile(path);
    // Windows \r\n ni ham handle qilish
    content = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

    var lines = content.split("\n");
    var currentKey = null;
    var currentSQL = [];

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var trimmed = line.trim();

        // -- KEY: formatdagi comment → yangi kalit
        if (trimmed.match(/^--\s*\w+:/)) {
            // Oldingi kalitni saqlash
            if (currentKey !== null) {
                queries[currentKey] = currentSQL.join(" ").replace(/\s+/g, " ").trim();
            }
            // Yangi kalit olish: "-- CREATE_USERS:" → "CREATE_USERS"
            var colonIdx = trimmed.indexOf(":");
            currentKey = trimmed.substring(2, colonIdx).trim();
            currentSQL = [];

        } else if (trimmed.startsWith("--")) {
            // Oddiy comment — o'tkazib yuborish
            continue;

        } else if (currentKey !== null && trimmed.length > 0) {
            currentSQL.push(trimmed);
        }
    }

    // Oxirgi kalitni saqlash
    if (currentKey !== null && currentSQL.length > 0) {
        queries[currentKey] = currentSQL.join(" ").replace(/\s+/g, " ").trim();
    }

    if (callback) callback();
}
