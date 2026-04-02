
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
