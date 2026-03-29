function LoadSQLFile(path, callback) {
    var content = app.ReadFile(path);
    var lines = content.split("\n");
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        if (!line) continue;
        var sep = line.indexOf(":");
        if (sep !== -1) {
            var key = line.substring(0, sep).trim();
            var sql = line.substring(sep + 1).trim();
            queries[key] = sql;
        }
    }
    if (callback) callback();
}
