var AndroidPath;
var queries = {};
var db;

function OnStart() {
    AndroidPath = app.GetPath();
    // androidpth bu /storage/emulated/0/Android/data/<package_name>/files

    app.Script("main/LOAD_SQL/LoadSQL.js", true);
    // LoadSQLFile USED FUNCTION
    // that function used inside InitDB function
    InitDB();

    app.Script("pages/CacheLoad/CacheLoad.js", true);
    // AppendNumber LoadNumber_3 init_Cache USED FUNCTIONS
    init_Cache();

    LoadNumber_3();

    // app.Script("pages/btnscript.js", true);
    // Bu fayl CacheLoad.js ga ko'chirildi, 
    // chunki u yerda LoadNumber_3 va UpdateUI funksiyalari bor
    
    // ShowViloyat Viloyat_OnTouch USED FUNCTION
    // is used in index.html file and here
    // to select viloyat for usage SQL queries

    initService();

    app.Script("pages/SQL_callback/SQL_Callback.js", true);
    // onUpdateSuccess onUpdateError USED FUNCTIONS
    // that functions used inside UPDATE_USER_NAME_BY_PHONE_ function
}

///////////////////////////////////////////////////////////////////////////////////
function InitDB() {
    db = app.OpenDatabase( AndroidPath + "/MyData.db" );

    let path = "pages/SQL/main.sql";
    let content = app.ReadFile(path); 
    let hasfile = app.FileExists(path);

    // var queries = {}; GLOBAL USAGE
    // tepadagi var ga LoadSQLFile funsiyasi key kirityapti 

    LoadSQLFile(hasfile, content, function() {  });

    // app.ShowPopup("SQL funksiyalari yuklandi!");
}

function INSERT_USER_PHONE_ROLE_(phone, role) {
    db.ExecuteSql(
        queries["INSERT_USER_PHONE_ROLE_"],
        [phone, role], onUpdateSuccess, onUpdateError
    );
}

function UPDATE_USER_NAME_BY_PHONE_(phone, name) {
    db.ExecuteSql(
        queries["UPDATE_USER_NAME_BY_PHONE_"],
        [name, phone], onUpdateSuccess, onUpdateError
    );
}

function UPDATE_USER_ROLE_BY_PHONE_(phone, role) {
    db.ExecuteSql(
        queries["UPDATE_USER_ROLE_BY_PHONE_"],
        [role, phone], onUpdateSuccess, onUpdateError
    );
}






















                          ///////////////////////////////                                           
                         // ==== SERVICE START =====  //                                            
                        /////////////////////////////// 

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

    
function initService() {                                                        
      ///////////////////////////////                                           
     // ===== SERVICE TIME =====  //                                            
    ///////////////////////////////                                             

    // Service bilan bog'lanish
        svc = app.CreateService("this", "this", OnServiceReady);
        svc.SetOnMessage(OnServiceMessage);
    
        // Service ni foreground qilish
        svc.SetInForeground("OCR Service", "JSON monitoring active");
    
        // Telefon restart bo'lsa ham ishlasin
        app.SetAutoBoot("Service");                                              
    
    // app.ShowPopup("Service ishga tushdi");
}

function OnServiceReady() {
    // app.ShowPopup("Service tayyor");
}

function OnServiceMessage(number) {
    app.ShowPopup( number );
    AppendNumber( number );
}

function OnStop() {
    app.Debug("App yopildi lekin service ishlaydi");
}

function GetName() {
    return "Behzod";
}

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
