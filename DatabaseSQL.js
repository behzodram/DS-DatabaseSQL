var queries = {};
var db;
var currentTable = "users";

function OnStart() {
    app.SetOrientation("portrait");

    lay = app.CreateLayout("linear", "VCenter,FillXY");

    layBtns = app.CreateLayout("linear", "Horizontal");

    btnAdd = app.CreateButton("+ Qo'sh", 0.3, 0.09);
    btnAdd.SetOnTouch(btnAdd_OnTouch);
    layBtns.AddChild(btnAdd);

    btnTables = app.CreateButton("Tables", 0.3, 0.09);
    btnTables.SetOnTouch(function() { ListAllTables(); });
    layBtns.AddChild(btnTables);

    btnQueries = app.CreateButton("Queries", 0.3, 0.09);
    btnQueries.SetOnTouch(function() { ListAllQueries(); });
    layBtns.AddChild(btnQueries);

    lay.AddChild(layBtns);

    web = app.CreateWebView(1, 0.82);
    web.SetBackColor("#1e1e1e");
    web.SetOnConsole(function(msg) {
        if (msg && msg.indexOf("DS_MSG:") === 0) {
            OnWebMsg(msg.replace("DS_MSG:", ""));
        }
    });
    lay.AddChild(web);

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
        db.ExecuteSql(queries["CRT_DEALS"]);
        db.ExecuteSql(queries["CRT_CHATS"]);
        db.ExecuteSql(queries["CRT_CONFERENCE"]);
        db.ExecuteSql(queries["CRT_DRIVER_INTERESTED"]);
        DisplayTable("users");
        SetStatus("Tayyor");
    });
}

function btnAdd_OnTouch() {
    if (currentTable === "users") {
        var phone = "+998" + Math.floor(900000000 + Math.random() * 99999999);
        db.ExecuteSql(
            "INSERT OR IGNORE INTO users (phone, role, name) VALUES (?,?,?)",
            [phone, "driver", "User_" + Math.floor(Math.random() * 999)]
        );
    } else if (currentTable === "loads") {
        var reg = ["Toshkent","Samarqand","Buxoro","Namangan","Andijon","Farg'ona"];
        var from = reg[Math.floor(Math.random() * reg.length)];
        var to   = reg[Math.floor(Math.random() * reg.length)];
        db.ExecuteSql(
            "INSERT INTO loads (raw_text, from_loc, to_loc, vehicle_type, owner_phone, exp_at) VALUES (?,?,?,?,?,?)",
            ["Sinov yuk " + from + " -> " + to, from, to, "TENT FURA", "+99890000000", "2025-12-31"]
        );
    } else if (currentTable === "deals") {
        db.ExecuteSql(
            "INSERT INTO deals (load_id, driver_phone, shipper_phone, status) VALUES (?,?,?,?)",
            [1, "+99890000001", "+99890000002", "pending"]
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