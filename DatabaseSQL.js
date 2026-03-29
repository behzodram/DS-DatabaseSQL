var queries = {};
var db;
var currentTable = "loads";   // <-- qaysi table ochiq ekanligini saqlaydi

function OnStart() {
    app.SetOrientation("portrait");

    lay = app.CreateLayout("linear", "VCenter,FillXY");

    // Tugmalar
    layBtns = app.CreateLayout("linear", "Horizontal");

    btnAdd = app.CreateButton("+ Qo'sh", 0.45, 0.09);
    btnAdd.SetOnTouch(btnAdd_OnTouch);
    layBtns.AddChild(btnAdd);

    btnTables = app.CreateButton("Tables", 0.45, 0.09);
    btnTables.SetOnTouch(btnTables_OnTouch);
    layBtns.AddChild(btnTables);
    lay.AddChild(layBtns);

    web = app.CreateWebView(1, 0.82);
    web.SetBackColor("#1e1e1e");
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
        db.ExecuteSql(queries["CREATE_USERS"]);
        db.ExecuteSql(queries["CREATE_LOADS"]);
        db.ExecuteSql(queries["CREATE_LOAD_CONTACTS"]);
        db.ExecuteSql(queries["CREATE_DRIVERS"]);
        db.ExecuteSql(queries["CREATE_DRIVER_INTEREST"]);
        db.ExecuteSql(queries["CREATE_LOAD_CHAT"]);
        db.ExecuteSql(queries["CREATE_LOAD_CONFERENCE"]);
        DisplayTable("load_chat");
        SetStatus("Tayyor");
    });
}

function btnAdd_OnTouch() {
    // Qaysi table ochiq bo'lsa unga mos namuna qo'shadi
    if (currentTable === "users") {
        var phone = "+998" + Math.floor(900000000 + Math.random() * 99999999);
        var name  = "User_" + Math.floor(Math.random() * 999);
        db.ExecuteSql("INSERT OR IGNORE INTO users (phone_or_tg, name) VALUES (?,?)", [phone, name]);

    } else if (currentTable === "loads") {
        var regions = ["Toshkent","Samarqand","Buxoro","Namangan","Andijon","Farg'ona"];
        var from = regions[Math.floor(Math.random() * regions.length)];
        var to   = regions[Math.floor(Math.random() * regions.length)];
        var id   = "L" + Math.floor(Math.random() * 9000 + 1000);
        db.ExecuteSql(
            "INSERT OR IGNORE INTO loads (load_id, from_region, to_region, description, vehicle_type, status) VALUES (?,?,?,?,?,?)",
            [id, from, to, "Sinov yuk", "TENT FURA", "LOW_main"]
        );

    } else if (currentTable === "drivers") {
        var phone2 = "+998" + Math.floor(900000000 + Math.random() * 99999999);
        db.ExecuteSql(
            "INSERT OR IGNORE INTO drivers (name, phone) VALUES (?,?)",
            ["Haydovchi_" + Math.floor(Math.random()*999), phone2]
        );
    } else {
        app.ShowPopup("Bu table uchun qo'shish hali sozlanmagan");
        return;
    }
    DisplayTable(currentTable);
}

function btnTables_OnTouch() {
    ListAllTables();
}

function SetStatus(msg) {
    txtStatus.SetText("● " + msg);
}