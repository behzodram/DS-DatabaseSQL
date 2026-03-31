var queries = {};
var db;

function OnStart() {
    app.Script("main/LOAD_SQL/LoadSQL.js", true);

    InitDB();
    
    initService();
}

///////////////////////////////////////////////////////////////////////////////////
function InitDB() {
    db = app.OpenDatabase("MyData");

    let path = "pages/SQL/main.sql";
    let content = app.ReadFile(path); 
    let hasfile = app.FileExists(path);

    // var queries = {}; GLOBAL USAGE
    // tepadagi var ga LoadSQLFile funsiyasi key kirityapti 

    LoadSQLFile(hasfile, content, function() {  });

    app.ShowPopup("SQL funksiyalari yuklandi!");
}

function INSERT_USER_PHONE_ROLE_(phone, role) {
    db.ExecuteSql(
        queries["INSERT_USER_PHONE_ROLE_"],
        [phone, role]
    );

    app.ShowPopup("Yangi foydalanuvchi qo'shildi!");
}

function UPDATE_USER_NAME_BY_PHONE_(phone, name) {
    db.ExecuteSql(
        queries["UPDATE_USER_NAME_BY_PHONE_"],
        [name, phone]
    );

    app.ShowPopup("Foydalanuvchi nomi yangilandi!");
}

function UPDATE_USER_ROLE_BY_PHONE_(phone, role) {
    db.ExecuteSql(
        queries["UPDATE_USER_ROLE_BY_PHONE_"],
        [role, phone]
    );

    app.ShowPopup("Foydalanuvchi roli yangilandi!");
}

function INSERT_Load_RAW_FROM_TO_VEHICLE_OWNPhone_EXP_(
    raw, from, to, vehicle, ownphone, exp) {   
    db.ExecuteSql(
        queries["INSERT_Load_RAW_FROM_TO_VEHICLE_OWNPhone_EXP_"],
        [raw, from, to, vehicle, ownphone, exp]
    );

    app.ShowPopup("Yangi yuk qo'shildi!");
}

function INSERT_Deal_LoadID_DRWPhone_ShipPhone_STATUS_(
    DRWPhone, ShipPhone, STATUS) {
    db.ExecuteSql(
        queries["INSERT_Deal_LoadID_DRWPhone_ShipPhone_STATUS_"],
        [DRWPhone, ShipPhone, STATUS]
    );

    app.ShowPopup("Yangi deal qo'shildi!");
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
    
    app.ShowPopup("Service ishga tushdi");
}

function OnServiceReady() {
    app.ShowPopup("Service tayyor");
}
    
function OnServiceMessage(msg) {
    NUMBER = msg;
    app.ShowPopup(msg);
        
    MESSAGE = "SALOMAT" + NUMBER;
}
    
function OnStop() {
    app.Debug("App yopildi lekin service ishlaydi");
}


/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
