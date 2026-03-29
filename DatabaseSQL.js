var queries = {};
var db;
var currentTable = "users";

function OnStart() {
    app.SetOrientation("portrait");

    lay = app.CreateLayout("linear", "VCenter,FillXY");

    // --- Tugmalar ---
    layBtns = app.CreateLayout("linear", "Horizontal");

    btnAdd = app.CreateButton("+ Qo'sh", 0.3, 0.09);
    btnAdd.SetOnTouch(btnAdd_OnTouch);
    layBtns.AddChild(btnAdd);

    btnTables = app.CreateButton("Tables", 0.3, 0.09);
    btnTables.SetOnTouch(function(){ ListAllTables(); });
    layBtns.AddChild(btnTables);

    btnQueries = app.CreateButton("Queries", 0.3, 0.09);
    btnQueries.SetOnTouch(function(){ ListAllQueries(); });
    layBtns.AddChild(btnQueries);

    lay.AddChild(layBtns);

    // --- WebView ---
    web = app.CreateWebView(1, 0.82);
    web.SetBackColor("#1e1e1e");
    web.SetOnConsole(function(msg) {
        if (msg && msg.indexOf("DS_MSG:") === 0) {
            OnWebMsg(msg.replace("DS_MSG:", ""));
        }
    });
    lay.AddChild(web);

    // --- Status ---
    txtStatus = app.CreateText("Yuklanmoqda...", 0.95, 0.06);
    txtStatus.SetTextSize(11);
    txtStatus.SetTextColor("#888888");
    // txtStatus.SetTextAlignment("Center");
    lay.AddChild(txtStatus);

    app.AddLayout(lay);

    app.Script("LoadSQL.js", true);
    app.Script("LoadTable.js", true);

    LoadSQLFile("Queries.sql", function() {
        db = app.OpenDatabase("MyData");
        db.ExecuteSql(queries["CRT_USERS"]);
        db.ExecuteSql(queries["CRT_LOADS"]);
        db.ExecuteSql(queries["CRT_LD_CONTACTS"]);
        db.ExecuteSql(queries["CRT_DRIVERS"]);
        db.ExecuteSql(queries["CRT_DRV_INTEREST"]);
        db.ExecuteSql(queries["CRT_LD_CHAT"]);
        db.ExecuteSql(queries["CRT_LD_CONFERENCE"]);
        DisplayTable("users");
        SetStatus("Tayyor");
    });
}

function btnAdd_OnTouch() {
    if (currentTable === "users") {
        var phone = "+998" + Math.floor(900000000 + Math.random() * 99999999);
        db.ExecuteSql(
            "INSERT OR IGNORE INTO users (phone_or_tg, name) VALUES (?,?)",
            [phone, "User_" + Math.floor(Math.random() * 999)]
        );
    } else if (currentTable === "loads") {
        var reg = ["Toshkent","Samarqand","Buxoro","Namangan","Andijon","Farg'ona"];
        db.ExecuteSql(
            "INSERT INTO loads (from_region, to_region, description, vehicle_type, status) VALUES (?,?,?,?,?)",
            [reg[Math.floor(Math.random()*reg.length)],
             reg[Math.floor(Math.random()*reg.length)],
             "Sinov yuk", "TENT FURA", "LOW_main"]
        );
    } else if (currentTable === "drivers") {
        db.ExecuteSql(
            "INSERT OR IGNORE INTO drivers (name, phone) VALUES (?,?)",
            ["Haydovchi_" + Math.floor(Math.random()*999),
             "+998" + Math.floor(900000000 + Math.random() * 99999999)]
        );
    } else {
        app.ShowPopup("Bu table uchun qo'shish sozlanmagan");
        return;
    }
    DisplayTable(currentTable);
}

function SetStatus(msg) {
    txtStatus.SetText("● " + msg);
}