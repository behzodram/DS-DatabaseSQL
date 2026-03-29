var queries = {};

function OnStart() {
    lay = app.CreateLayout("linear", "VCenter,FillXY");
    btnAdd = app.CreateButton("Add", 0.6, 0.1);
    btnAdd.SetOnTouch(btnAdd_OnTouch);
    lay.AddChild(btnAdd);
    txt = app.CreateText("", 0.9, 0.4, "multiline");
    lay.AddChild(txt);
    app.AddLayout(lay);

    // SQL faylni o'qib, so'ngra DB ishlarini boshlash
    LoadSQLFile("Queries.sql", function() {
        db = app.OpenDatabase("MyData");
        db.ExecuteSql(queries["CREATE_TABLE"]);
        DisplayAllRows();
    });
}

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

function btnAdd_OnTouch() {
    db.ExecuteSql(queries["INSERT_DATA"], ["Hello!"]);
    DisplayAllRows();
}

function DisplayAllRows() {
    txt.SetText("");
    db.ExecuteSql(queries["SELECT_ALL"], [], function(results) {
        var s = "";
        for (var i = 0; i < results.rows.length; i++) {
            var item = results.rows.item(i);
            s += item.id + ": " + item.data + "\n";
        }
        txt.SetText(s);
    });
}