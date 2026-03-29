var queries = {};

function OnStart() {
    lay = app.CreateLayout("linear", "VCenter,FillXY");
    btnAdd = app.CreateButton("Add", 0.6, 0.1);
    btnAdd.SetOnTouch(btnAdd_OnTouch);
    lay.AddChild(btnAdd);
    txt = app.CreateText("", 0.9, 0.4, "multiline");
    lay.AddChild(txt);
    app.AddLayout(lay);

    // SQL faylni o'qish uchun LoadSQL.js skriptini qo'shish
    app.Script("LoadSQL.js", true);
    
    // SQL faylni o'qib, so'ngra DB ishlarini boshlash
    LoadSQLFile("Queries.sql", function() {
        db = app.OpenDatabase("MyData");
        db.ExecuteSql(queries["CREATE_TABLE"]);
        DisplayAllRows();
    });
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