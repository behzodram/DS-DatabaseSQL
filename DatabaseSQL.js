var isTableView = false;
var AndroidPath;
var queries = {};
var db;

function OnStart() {
    app.SetOrientation("portrait");

    // ── Asosiy layout (Vertical) ────────────────────────────────
    layMain = app.CreateLayout("Linear", "Vertical,FillXY");

    //  Yuqori qism: content (0.93) + button (0.07), balandlik 0.94
    layTop = app.CreateLayout("Linear", "Horizontal,FillX", 1, 0.94);

    // 1. App WebView
    webApp = app.CreateWebView(0.93, 1);
    webApp.SetOnConsole(function(msg) {
        if (msg && msg.indexOf("DS_MSG:") === 0)
            OnAppMsg(msg.replace("DS_MSG:", ""));
    });
    layTop.AddChild(webApp);

    // 2. Table WebView (boshlangʻichda yashirin)
    webTable = app.CreateWebView(0.93, 1);
    webTable.SetBackColor("#1e1e1e");
    webTable.SetOnConsole(function(msg) {
        if (msg && msg.indexOf("DS_MSG:") === 0)
            OnWebMsg(msg.replace("DS_MSG:", ""));
    });
    webTable.SetVisibility("Gone");
    layTop.AddChild(webTable);

    // 3. Toggle bar — har doim ko'rinadi
    btnToggle = app.CreateButton("⋮", 0.07, 1);
    btnToggle.SetStyle("#161616", "#1e1e1e", 0, "#2a2a2a", 1, 0);
    btnToggle.SetTextColor("#555555");
    btnToggle.SetTextSize(22);
    btnToggle.SetOnTouch(ToggleView);
    layTop.AddChild(btnToggle);

    layMain.AddChild(layTop);

    // Quyi status satri (faqat table view uchun), balandlik 0.06
    txtStatus = app.CreateText("", 1, 0.06);
    txtStatus.SetTextSize(11);
    txtStatus.SetTextColor("#888888");
    txtStatus.SetVisibility("Gone");
    layMain.AddChild(txtStatus);

    app.AddLayout(layMain);

    // ── SQL yuklash ─────────────────────────────────────────────
    app.Script("main/LOAD_SQL/LoadSQL.js", true);
    app.Script("main/LOAD_SQL/LoadTable.js", true);

    let path    = "main/SQL/Queries.sql";
    let content = app.ReadFile(path);
    let hasfile = app.FileExists(path);

    AndroidPath = app.GetPath();
    // androidpth bu /storage/emulated/0/Android/data/<package_name>/files
    
    LoadSQLFile(hasfile, content, function() {
        db = app.OpenDatabase( AndroidPath + "/MyData.db" );
        db.ExecuteSql(queries["CRT_USERS"]);
        db.ExecuteSql(queries["CRT_LOADS"]);
        db.ExecuteSql(queries["CRT_DEALS"]);
        db.ExecuteSql(queries["CRT_CHATS"]);
        db.ExecuteSql(queries["CRT_CONFERENCE"]);
        db.ExecuteSql(queries["CRT_DRIVER_INTERESTED"]);
        SwitchToAppView();
    });
}

// ── View switching ──────────────────────────────────────────────
function ToggleView() {
    if (isTableView) SwitchToAppView();
    else             SwitchToTableView();
}

function SwitchToAppView() {
    isTableView = false;
    webApp.SetVisibility("Visible");
    webTable.SetVisibility("Gone");
    txtStatus.SetVisibility("Gone");
    btnToggle.SetText("⋮");
    web = webApp;
    webApp.LoadUrl("pages/index.html");
}

function SwitchToTableView() {
    isTableView = true;
    webApp.SetVisibility("Gone");
    webTable.SetVisibility("Visible");
    txtStatus.SetVisibility("Visible");
    btnToggle.SetText("⋮");
    web = webTable;
    ListAllTables();
}

// ── Xabar handlerlari ───────────────────────────────────────────
function OnAppMsg(msg) {
    // keyingi bosqichda to'ldiriladi
}

function OnWebMsg(msg) {
    // keyingi bosqichda to'ldiriladi
}

function SetStatus(msg) {
    txtStatus.SetText("● " + msg);
}