const performance = require('perf_hooks').performance;
module.exports = {
    loadDrilldown: (req, res) => {
        res.render('drilldown.ejs', { // Pass data to front end
            title: "Drill-down Query",
            result: false,
            headers: false
        });
    },
    queryDrilldown: (req, res) => {
        //query here
        let field1 = req.body.field1; // drilldown 5 fields
        let field2 = req.body.field2; // drilldown 5 fields
        let field3 = req.body.field3; // drilldown 5 fields
        let field4 = req.body.field4; // drilldown 5 fields
        let field5 = req.body.field5; // drilldown 5 fields
        let query;
        let listCheck = [field1, field2, field3, field4, field5];
        if (listCheck.indexOf("author") > -1 || listCheck.indexOf("author_type") > -1){
            if (listCheck.indexOf("artist") > -1 || listCheck.indexOf("label") > -1){
                query = `SELECT ` + field1 + `, ` + field2 + `, ` + field3 + `, ` + field4 + `, ` + field5 + `, AVG(score - (SELECT AVG(score) FROM reviews)) avgNormScore
                            FROM reviews r, artist a, author au, time t
                            WHERE r.authorid = au.authorid AND r.timeid = t.timeid AND r.artistid = a.artistid
                            GROUP BY ` + field1 + `, ` + field2 + `, ` + field3 + `, ` + field4 + `, ` + field5 + `;`;
            }
            else{
                query = `SELECT ` + field1 + `, ` + field2 + `, ` + field3 + `, ` + field4 + `, ` + field5 + `, AVG(score - (SELECT AVG(score) FROM reviews)) avgNormScore
                            FROM reviews r, author au, time t
                            WHERE r.authorid = au.authorid AND r.timeid = t.timeid
                            GROUP BY ` + field1 + `, ` + field2 + `, ` + field3 + `, ` + field4 + `, ` + field5 + `;`;
            }
        }
        else{
            query = `SELECT ` + field1 + `, ` + field2 + `, ` + field3 + `, ` + field4 + `, ` + field5 + `, AVG(score - (SELECT AVG(score) FROM reviews)) avgNormScore
                        FROM reviews r, artist a, time t
                        WHERE r.timeid = t.timeid AND r.artistid = a.artistid
                        GROUP BY ` + field1 + `, ` + field2 + `, ` + field3 + `, ` + field4 + `, ` + field5 + `;`;
        }
        console.log(query);
        db.query(query, (err, output) => {
            if (err) res.redirect('/'); 

            res.render('drilldown.ejs', { // Pass data to front end
                title: "Drill-down Query", 
                result: output,
                headers: {
                    field1: field1,
                    field2: field2,
                    field3: field3,
                    field4: field4,
                    field5: field5
                }
            });
        });
    },
}