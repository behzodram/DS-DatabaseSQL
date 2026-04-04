function ExecSQL(sql, params, onResult, silent) {
    db.ExecuteSql(
        sql,
        params || [],
        function(res) {
            if (!silent) app.ShowPopup("Success: ✅");
            if (onResult) onResult(res);
        },
        function(err) {
            app.ShowPopup("Error: ❌" + err);
            console.log(err);
        }
    );
}