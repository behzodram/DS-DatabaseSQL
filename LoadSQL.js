function LoadSQLFile(path, callback) {
    var file = app.ReadFile(path);
    var content = file.toString("utf-8");

    // Har bir qatorni parse qilish
    var lines = content.split("\n");
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        if (line.length === 0) continue; // bo'sh qatorni o'tkazib yuborish
        var sep = line.indexOf(":");
        if (sep !== -1) {
            var key = line.substring(0, sep).trim();
            var sql = line.substring(sep + 1).trim();
            queries[key] = sql;
        }
    }

    if (callback) callback();
}
