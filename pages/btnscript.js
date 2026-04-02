// --- Drawer Dialogs ---
let VIL_DIALOG;

function ShowDialog(name) {
    let data = "";
    if (name === "FABJ") data = "FAR,AND,BUX,JIZ";
    else if (name === "XoQoN") data = "XOR,QASH,QORA,NAV";
    else if (name === "SuT") data = "SAM,SUR,TOSH,SIRD";

    VIL_DIALOG = app.CreateListDialog(name, data);
    VIL_DIALOG.SetOnTouch(Viloyat_OnTouch);
    VIL_DIALOG.Show();
}

function Viloyat_OnTouch(item) {
    app.ShowPopup(item);
    return item;
}