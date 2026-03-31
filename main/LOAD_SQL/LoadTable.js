function GetTableCSS() {
    return [
        "<style>",
        "* { box-sizing: border-box; margin: 0; padding: 0; }",
        "body { background: #1e1e1e; color: #e0e0e0; font-family: monospace; font-size: 13px; padding: 6px; }",
        "h3 { color: #FFD700; text-align: center; margin-bottom: 6px; font-size: 14px; letter-spacing: 1px; }",
        "table { width: 100%; border-collapse: collapse; }",
        "thead tr { background: #2a2a2a; }",
        "th { color: #FFD700; padding: 7px 8px; text-align: left; border-bottom: 2px solid #444; font-size: 11px; text-transform: uppercase; white-space: nowrap; }",
        "td { padding: 6px 8px; border-bottom: 1px solid #2e2e2e; color: #ccc; white-space: nowrap; max-width: 140px; overflow: hidden; text-overflow: ellipsis; }",
        "tr:nth-child(even) { background: #252525; }",
        "tr:hover { background: #2f3a2f; }",
        ".null { color: #555; font-style: italic; }",
        ".badge { display:inline-block; padding:2px 7px; border-radius:10px; font-size:11px; }",
        ".badge-low  { background:#1a3a1a; color:#4caf50; }",
        ".badge-high { background:#3a1a1a; color:#f44336; }",
        ".empty { text-align:center; color:#555; padding:20px; }",
        ".footer { text-align:center; color:#555; font-size:11px; margin-top:8px; padding-bottom:4px; }",
        ".btn { border:none; padding:4px 10px; border-radius:8px; font-size:12px; cursor:pointer; font-family:monospace; margin:2px; }",
        ".btn-view { background:#1a3a2a; color:#4caf50; border:1px solid #4caf50; }",
        ".btn-drop { background:#3a1a1a; color:#f44336; border:1px solid #f44336; }",
        ".btn-create { background:#1a2a3a; color:#64b5f6; border:1px solid #64b5f6; }",
        ".btn-run  { background:#1a2a3a; color:#64b5f6; border:1px solid #64b5f6; }",
        ".sel-row  { background:#2f3a2f !important; outline:1px solid #4caf50; }",
        ".qkey { color:#FFD700; }",
        ".qsql { color:#aaa; font-size:11px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:200px; display:inline-block; vertical-align:middle; }",
        ".tag-create { color:#4caf50; }",
        ".tag-drop   { color:#f44336; }",
        ".tag-select { color:#64b5f6; }",
        ".tag-pragma { color:#ffb74d; }",
        ".tag-other  { color:#aaa; }",
        "</style>"
    ].join("");
}

function GetMsgScript() {
    return [
        "<script>",
        "function sendMsg(msg) {",
        "  console.log('DS_MSG:' + msg);",
        "}",
        "function selectTable(name) {",
        "  document.querySelectorAll('tr.tbl-row').forEach(function(r){ r.classList.remove('sel-row'); });",
        "  var el = document.getElementById('row_' + name);",
        "  if(el) el.classList.add('sel-row');",
        "  sendMsg('view:' + name);",
        "}",
        "function dropTable(name) {",
        "  sendMsg('drop:' + name);",
        "}",
        "function createTable(name) {",
        "  sendMsg('create:' + name);",
        "}",
        "function runQuery(key) {",
        "  sendMsg('run:' + key);",
        "}",
        "</script>"
    ].join("");
}

function GetQueryTag(sql) {
    var s = sql.trim().toUpperCase();
    if (s.indexOf("CREATE") === 0) return "<span class='tag-create'>CREATE</span>";
    if (s.indexOf("DROP")   === 0) return "<span class='tag-drop'>DROP</span>";
    if (s.indexOf("SELECT") === 0) return "<span class='tag-select'>SELECT</span>";
    if (s.indexOf("PRAGMA") === 0) return "<span class='tag-pragma'>PRAGMA</span>";
    return "<span class='tag-other'>SQL</span>";
}

function OnWebMsg(msg) {
    var sep    = msg.indexOf(":");
    var action = msg.substring(0, sep);
    var param  = msg.substring(sep + 1);

    if (action === "view") {
        DisplayTable(param);
    } else if (action === "drop") {
        DropTable(param);
    } else if (action === "create") {
        CreateTable(param);
    } else if (action === "run") {
        RunQuery(param);
    }
}

// ---------- CORE TABLES LIST ----------
var CORE_TABLES = ["users", "loads", "deals", "chats", "conference", "driver_interested"];

// ---------- TABLES LIST ----------
function ListAllTables() {
    SetStatus("Tablelar ro'yxati...");
    db.ExecuteSql(queries["LIST_TABLES"], [], function(results) {
        var existingTables = {};
        for (var i = 0; i < results.rows.length; i++) {
            existingTables[results.rows.item(i).name] = true;
        }

        var html = BuildHtmlHead();
        html += "<h3>[ sqlite_master ]</h3>";
        html += "<table><thead><tr><th>#</th><th>Table</th><th>See</th><th>O'chirish</th></tr></thead><tbody>";

        for (var i = 0; i < CORE_TABLES.length; i++) {
            var tn = CORE_TABLES[i];
            var exists = existingTables[tn] ? true : false;
            var status = exists ? "✓" : "✗";
            var rowStyle = !exists ? " style='opacity:0.6'" : "";

            html += "<tr class='tbl-row' id='row_" + tn + "'" + rowStyle + ">";
            html += "<td>" + (i + 1) + "</td>";
            html += "<td>" + tn + " " + status + "</td>";

            if (exists) {
                html += "<td><button class='btn btn-view' onclick='selectTable(\"" + tn + "\")'>See</button></td>";
                html += "<td><button class='btn btn-drop' onclick='dropTable(\"" + tn + "\")'>Drop</button></td>";
            } else {
                html += "<td>—</td>";
                html += "<td><button class='btn btn-create' onclick='createTable(\"" + tn + "\")'>Create</button></td>";
            }
            html += "</tr>";
        }

        html += "</tbody></table>";
        html += "<div class='footer'>" + CORE_TABLES.length + " ta table</div>";
        html += "</body></html>";
        web.LoadHtml(html);
        SetStatus(CORE_TABLES.length + " ta table");
    });
}

// ---------- DISPLAY TABLE ----------
function DisplayTable(tableName) {
    SetStatus("Yuklanmoqda: " + tableName + "...");
    currentTable = tableName;

    db.ExecuteSql("PRAGMA table_info(" + tableName + ")", [], function(colInfo) {
        if (colInfo.rows.length === 0) {
            web.LoadHtml(BuildHtmlHead() + "<div class='empty' style='color:#f44'>Table topilmadi: " + tableName + "</div></body></html>");
            return;
        }
        var cols = [];
        for (var c = 0; c < colInfo.rows.length; c++) {
            cols.push(colInfo.rows.item(c).name);
        }

        db.ExecuteSql("SELECT * FROM " + tableName, [], function(results) {
            var html = BuildHtmlHead();
            html += "<h3>[ " + tableName + " ]</h3>";
            html += "<table><thead><tr>";
            for (var c = 0; c < cols.length; c++) {
                html += "<th>" + cols[c] + "</th>";
            }
            html += "</tr></thead><tbody>";

            if (results.rows.length === 0) {
                html += "<tr><td colspan='" + cols.length + "' class='empty'>— bo'sh —</td></tr>";
            } else {
                for (var i = 0; i < results.rows.length; i++) {
                    var row = results.rows.item(i);
                    html += "<tr>";
                    for (var j = 0; j < cols.length; j++) {
                        var v = row[cols[j]];
                        html += "<td title='" + (v !== null ? String(v).replace(/'/g,"&#39;") : "") + "'>"
                              + FormatCell(cols[j], v) + "</td>";
                    }
                    html += "</tr>";
                }
            }
            html += "</tbody></table>";
            html += "<div class='footer'>" + results.rows.length + " ta qator | " + tableName + "</div>";
            html += "</body></html>";
            web.LoadHtml(html);
            SetStatus(results.rows.length + " qator | " + tableName);
        });
    });
}

// ---------- DROP TABLE ----------
function DropTable(tableName) {
    var dropKey = "DEL_" + tableName.toUpperCase();
    var sql = queries[dropKey];
    if (!sql) {
        sql = "DROP TABLE IF EXISTS " + tableName;
    }
    db.ExecuteSql(sql, [], function() {
        SetStatus(tableName + " o'chirildi");
        ListAllTables();
    });
}

// ---------- CREATE TABLE ----------
function CreateTable(tableName) {
    var createKey = "CRT_" + tableName.toUpperCase();
    var sql = queries[createKey];
    if (!sql) {
        SetStatus("CREATE query topilmadi: " + createKey);
        return;
    }
    db.ExecuteSql(sql, [], function() {
        SetStatus(tableName + " yaratildi");
        ListAllTables();
    });
}

// ---------- RUN QUERY ----------
// function RunQuery(key) {
//     var sql = queries[key];
//     if (!sql) { SetStatus("Query topilmadi: " + key); return; }

//     var sqlUp = sql.trim().toUpperCase();

//     // SELECT → natijani ko'rsat
//     if (sqlUp.indexOf("SELECT") === 0) {
//         SetStatus("SELECT ishga tushdi: " + key);
//         db.ExecuteSql(sql, [], function(results) {
//             if (results.rows.length === 0) {
//                 ShowRunResult(key, sql, [], []);
//                 return;
//             }
//             var firstRow = results.rows.item(0);
//             var cols = [];
//             for (var c in firstRow) {
//                 if (firstRow.hasOwnProperty(c)) cols.push(c);
//             }
//             var rows = [];
//             for (var i = 0; i < results.rows.length; i++) {
//                 rows.push(results.rows.item(i));
//             }
//             ShowRunResult(key, sql, cols, rows);
//         });
//     } else {
//         // CREATE, DROP, INSERT, PRAGMA va boshqalar
//         db.ExecuteSql(sql, [], function() {
//             SetStatus("OK: " + key);
//             ShowRunResult(key, sql, [], null);
//         });
//     }
// }

function ShowRunResult(key, sql, cols, rows) {
    var html = BuildHtmlHead();
    html += "<h3>[ " + key + " ]</h3>";
    html += "<div style='color:#aaa;font-size:11px;padding:4px 2px 8px;word-break:break-all'>" + sql + "</div>";

    if (rows === null) {
        html += "<div class='empty' style='color:#4caf50;padding:16px'>✓ Muvaffaqiyatli bajarildi</div>";
    } else if (rows.length === 0) {
        html += "<div class='empty'>— natija yo'q —</div>";
    } else {
        html += "<table><thead><tr>";
        for (var c = 0; c < cols.length; c++) html += "<th>" + cols[c] + "</th>";
        html += "</tr></thead><tbody>";
        for (var i = 0; i < rows.length; i++) {
            html += "<tr>";
            for (var j = 0; j < cols.length; j++) {
                html += "<td>" + FormatCell(cols[j], rows[i][cols[j]]) + "</td>";
            }
            html += "</tr>";
        }
        html += "</tbody></table>";
        html += "<div class='footer'>" + rows.length + " ta natija</div>";
    }
    html += "</body></html>";
    web.LoadHtml(html);
}

// ---------- HELPERS ----------
function BuildHtmlHead() {
    return "<!DOCTYPE html><html><head><meta name='viewport' content='width=device-width,initial-scale=1'>"
         + GetTableCSS() + GetMsgScript() + "</head><body>";
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