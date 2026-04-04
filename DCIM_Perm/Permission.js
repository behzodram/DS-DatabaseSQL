
// Write a file to Internal storage.
function DCIM_Access() {
    var fldr = "/Internal/DCIM";
    var perm = "internal";

    // Check if we have permission to write to folder.
    if (!app.CheckPermission(fldr)) {
        app.ShowPopup(fldr + " ga yozish uchun ruxsat kerak");
        app.GetPermission(perm, OnPermission);
        return;
    }
}

// Handle result of permission request.
function OnPermission(path, uri) {
    if (!path)
        app.ShowPopup("Permission not granted!");
    else
        DCIM_Access();
}