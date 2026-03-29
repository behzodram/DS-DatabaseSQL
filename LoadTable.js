function GetTableCSS() {
    return [
        "<style>",
        "* { box-sizing: border-box; margin: 0; padding: 0; }",
        "body { background: #1e1e1e; color: #e0e0e0; font-family: monospace; font-size: 13px; padding: 6px; }",
        "h3 { color: #FFD700; text-align: center; margin-bottom: 6px; font-size: 14px; letter-spacing: 1px; }",
        "table { width: 100%; border-collapse: collapse; }",
        "thead tr { background: #2a2a2a; }",
        "th { color: #FFD700; padding: 7px 10px; text-align: left; border-bottom: 2px solid #444; font-size: 12px; text-transform: uppercase; white-space: nowrap; }",
        "td { padding: 6px 10px; border-bottom: 1px solid #2e2e2e; color: #ccc; white-space: nowrap; max-width: 160px; overflow: hidden; text-overflow: ellipsis; }",
        "tr:nth-child(even) { background: #252525; }",
        "tr:hover { background: #2f3a2f; }",
        ".null { color: #555; font-style: italic; }",
        ".badge { display: inline-block; padding: 2px 7px; border-radius: 10px; font-size: 11px; }",
        ".badge-low { background: #1a3a1a; color: #4caf50; }",
        ".badge-high { background: #3a1a1a; color: #f44336; }",
        ".empty { text-align: center; color: #555; padding: 20px; }",
        ".footer { text-align: center; color: #555; font-size: 11px; margin-top: 8px; padding-bottom: 4px; }",
        ".btn { border: none; padding: 4px 12px; border-radius: 8px; font-size: 12px; cursor: pointer; font-family: monospace; margin: 2px; }",
        ".btn-view { background: #1a3a2a; color: #4caf50; border: 1px solid #4caf50; }",
        ".btn-add  { background: #1a2a3a; color: #64b5f6; border: 1px solid #64b5f6; }",
        ".sel-row  { background: #2f3a2f !important; outline: 1px solid #4caf50; }",
        "</style>"
    ].join("");
}

function FormatCell(col, val) {
    if (val === null || val === undefined || val === "") {
        return "<span class='null'>NULL</span>";
    }
    val = String(val);
    if (col === "status") {
        if (val === "LOW_main")  return "<span class='badge badge-low'>LOW</span>";
        if (val === "HIGH_main") return "<span class='badge badge-high'>HIGH</span>";
    }
    if (val.length > 22) return val.substring(0, 20) + "…";
    return val;
}

// WebView -> DroidScript xabar yuborish skripti
function GetMsgScript() {
    return [
        "<script>",
        "function sendMsg(msg) {",
        "  console.log('DS_MSG:' + msg);",  // 🔥 MUHIM
        "}",
        "function selectTable(name) {",
        "  document.querySelectorAll('tr.tbl-row').forEach(function(r){ r.classList.remove('sel-row'); });",
        "  var el = document.getElementById('row_' + name);",
        "  if(el) el.classList.add('sel-row');",
        "  sendMsg('view:' + name);",
        "}",
        "</script>"
    ].join("");
}

function OnWebMsg(msg) {
    var parts = msg.split(":");
    var action = parts[0];
    var param  = parts.slice(1).join(":");  // table nomi ichida ':' bo'lmasin deb

    if (action === "view") {
        DisplayTable(param);
    }
}

function ListAllTables() {
    SetStatus("Tablelar ro'yxati...");

    db.ExecuteSql(queries["LIST_TABLES"], [], function(results) {
        var html = "<!DOCTYPE html><html><head>";
        html += "<meta name='viewport' content='width=device-width,initial-scale=1'>";
        html += GetTableCSS();
        html += GetMsgScript();
        html += "</head><body>";
        html += "<h3>[ sqlite_master ]</h3>";
        html += "<table><thead><tr><th>#</th><th>Table nomi</th><th>Ko'rish</th></tr></thead><tbody>";

        if (results.rows.length === 0) {
            html += "<tr><td colspan='3' class='empty'>— hech qanday table yo'q —</td></tr>";
        } else {
            for (var i = 0; i < results.rows.length; i++) {
                var tname = results.rows.item(i).name;
                html += "<tr class='tbl-row' id='row_" + tname + "'>";
                html += "<td>" + (i + 1) + "</td>";
                html += "<td>" + tname + "</td>";
                html += "<td><button class='btn btn-view' onclick='selectTable(\"" + tname + "\")'>Ko'rish</button></td>";
                html += "</tr>";
            }
        }

        html += "</tbody></table>";
        html += "<div class='footer'>" + results.rows.length + " ta table</div>";
        html += "</body></html>";

        web.LoadHtml(html);
        
        web.SetOnConsole(function(msg) {
            if (msg.startsWith("DS_MSG:")) {
                var realMsg = msg.replace("DS_MSG:", "");
                OnWebMsg(realMsg);
            }
        });

        SetStatus(results.rows.length + " ta table");
    });
}

function DisplayTable(tableName) {
    SetStatus("Yuklanmoqda: " + tableName + "...");
    currentTable = tableName;   // main.js ga ham kerak bo'ladi

    db.ExecuteSql("PRAGMA table_info(" + tableName + ")", [], function(colInfo) {
        if (colInfo.rows.length === 0) {
            web.LoadHtml("<body style='background:#1e1e1e;color:#f44;padding:20px;font-family:monospace'>Table topilmadi: " + tableName + "</body>");
            return;
        }

        var cols = [];
        for (var c = 0; c < colInfo.rows.length; c++) {
            cols.push(colInfo.rows.item(c).name);
        }

        db.ExecuteSql("SELECT * FROM " + tableName, [], function(results) {
            var rows = [];
            for (var i = 0; i < results.rows.length; i++) {
                rows.push(results.rows.item(i));
            }

            var html = "<!DOCTYPE html><html><head>";
            html += "<meta name='viewport' content='width=device-width,initial-scale=1'>";
            html += GetTableCSS();
            html += "</head><body>";
            html += "<h3>[ " + tableName + " ]</h3>";
            html += "<table><thead><tr>";
            for (var c = 0; c < cols.length; c++) {
                html += "<th>" + cols[c] + "</th>";
            }
            html += "</tr></thead><tbody>";

            if (rows.length === 0) {
                html += "<tr><td colspan='" + cols.length + "' class='empty'>— bo'sh —</td></tr>";
            } else {
                for (var i = 0; i < rows.length; i++) {
                    html += "<tr>";
                    for (var j = 0; j < cols.length; j++) {
                        html += "<td title='" + (rows[i][cols[j]] !== null ? String(rows[i][cols[j]]) : "") + "'>"
                              + FormatCell(cols[j], rows[i][cols[j]]) + "</td>";
                    }
                    html += "</tr>";
                }
            }

            html += "</tbody></table>";
            html += "<div class='footer'>" + rows.length + " ta qator | " + tableName + "</div>";
            html += "</body></html>";

            web.LoadHtml(html);
            SetStatus(rows.length + " qator | " + tableName);
        });
    });
}