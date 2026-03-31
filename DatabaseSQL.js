var queries = {};
var db;
var currentTable = "users";
var isTableView = false;

app.LoadPlugin( "Biometric" )

function OnStart() {
    app.SetOrientation("portrait");

    initBIO();
    // --- Asosiy layout ---
    layMain = app.CreateLayout("linear", "VCenter,FillXY");

    // --- Tugmalar qatori ---
    // layBtns = app.CreateLayout("linear", "Horizontal");

    // btnToggle = app.CreateButton("[ App ]", 0.3, 0.09);
    // btnToggle.SetOnTouch(btnToggle_OnTouch);
    // layBtns.AddChild(btnToggle);

    // btnTables = app.CreateButton("Tables", 0.3, 0.09);
    // btnTables.SetOnTouch(function() { SwitchToTableView(); ListAllTables(); });
    // layBtns.AddChild(btnTables);

    // layMain.AddChild(layBtns);

    // --- App WebView (index.html) ---
    webApp = app.CreateWebView(1, 1);
    // webApp.SetBackColor("#1e1e1e");
    webApp.SetOnConsole(function(msg) {
        if (msg && msg.indexOf("DS_MSG:") === 0) {
            OnAppMsg(msg.replace("DS_MSG:", ""));
        }
    });
    layMain.AddChild(webApp);

    // --- Table WebView ---
    webTable = app.CreateWebView(1, 0.82);
    webTable.SetBackColor("#1e1e1e");
    webTable.SetOnConsole(function(msg) {
        if (msg && msg.indexOf("DS_MSG:") === 0) {
            OnWebMsg(msg.replace("DS_MSG:", ""));
        }
    });
    webTable.SetVisibility("Gone");
    layMain.AddChild(webTable);

    // --- Status (faqat table view uchun) ---
    txtStatus = app.CreateText("", 0.95, 0.06);
    txtStatus.SetTextSize(11);
    txtStatus.SetTextColor("#888888");
    txtStatus.SetVisibility("Gone");
    layMain.AddChild(txtStatus);

    app.AddLayout(layMain);

    app.Script("main/LOAD_SQL/LoadSQL.js", true);
    app.Script("main/LOAD_SQL/LoadTable.js", true);
    // app.Script("LoadSQL.js", true);
    // app.Script("LoadTable.js", true);

    let path = "main/SQL/Queries.sql";
    let content = app.ReadFile(path);
    let hasfile = app.FileExists(path);

    LoadSQLFile(hasfile, content, function() {
        db = app.OpenDatabase("MyData");
        db.ExecuteSql(queries["CRT_USERS"]);
        db.ExecuteSql(queries["CRT_LOADS"]);
        db.ExecuteSql(queries["CRT_DEALS"]);
        db.ExecuteSql(queries["CRT_CHATS"]);
        db.ExecuteSql(queries["CRT_CONFERENCE"]);
        db.ExecuteSql(queries["CRT_DRIVER_INTERESTED"]);
        SwitchToAppView();
    });
}

// --- View switching ---

function SwitchToAppView() {
    isTableView = false;
    webApp.SetVisibility("Visible");
    webTable.SetVisibility("Gone");
    txtStatus.SetVisibility("Gone");
    // btnToggle.SetText("[ Tables ]");
    webApp.LoadUrl("pages/index.html");
}

function SwitchToTableView() {
    isTableView = true;
    webApp.SetVisibility("Gone");
    webTable.SetVisibility("Visible");
    txtStatus.SetVisibility("Visible");
    // btnToggle.SetText("[ App ]");
    web = webTable;
}

// function btnToggle_OnTouch() {
    
// }

// --- index.html dan kelgan xabarlar ---
function OnAppMsg(msg) {
    // keyingi bosqichda to'ldiriladi
}

function SetStatus(msg) {
    txtStatus.SetText("● " + msg);
}


function initBIO() {
    setInterval( btn_OnTouch, 300 )

    bio = app.CreateBiometric()
    if(!bio.IsHardwareDetected())
        app.Quit( "Your device not have fingerprint hardware.", "Sorry");
    if(!bio.HasEnrolledFingerprints())
        app.Quit( "Please, first enroll your finger on biometric/security settings on your device.", "Fingerprint not enrolled" )
}

function btn_OnTouch() {
  bio.BeginAuth( bio_OnAuth )
}

function bio_OnAuth(type, message) {
    //   app.Alert( message, type )
    if(type == "success") {
        app.ShowPopup("Authentication successful!");
        if (isTableView) {
            SwitchToAppView();
        } else {
            SwitchToTableView();
            ListAllTables();
        }
    }
}
