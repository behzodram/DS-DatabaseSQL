function OnStart() {
    lay = app.CreateLayout("linear", "VCenter,FillXY");

    btnAdd = app.CreateButton("Add", 0.6, 0.1);
    btnAdd.SetOnTouch(btnAdd_OnTouch);
    lay.AddChild(btnAdd);

    txt = app.CreateText("", 0.9, 0.4, "multiline");
    lay.AddChild(txt);

    app.AddLayout(lay);

    // DB ochish
    db = app.OpenDatabase("MyData");
    db.ExecuteSql("CREATE TABLE IF NOT EXISTS test_table (id INTEGER PRIMARY KEY, data TEXT)");
    
    DisplayAllRows();
}

function btnAdd_OnTouch() {
    db.ExecuteSql("INSERT INTO test_table (data) VALUES (?)", ["Hello!"]);
    DisplayAllRows();
}

function DisplayAllRows() {
    txt.SetText("");
    db.ExecuteSql("SELECT * FROM test_table;", [], function(results) {
        var s = "";
        for (var i = 0; i < results.rows.length; i++) {
            var item = results.rows.item(i);
            s += item.id + ": " + item.data + "\n";
        }
        txt.SetText(s);
    });
}