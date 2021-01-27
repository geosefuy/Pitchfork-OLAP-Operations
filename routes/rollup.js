const performance = require('perf_hooks').performance;
module.exports = {
    loadRollup: (req, res) => {
        res.render('rollup.ejs', { // Pass data to front end
            title: "Rollup Query",
            result: false,
            headers: false
        });
    },
    queryRollup: (req, res) => {
        //query here
        let field1 = req.body.field1;
        let field2 = req.body.field2;
        let field3 = req.body.field3;
        let field4 = req.body.field4;
        let query;
        if (field2 == "genre2"){
            query = `SELECT ` + field1 + `, ` + field2 + `, `+ field3 + `, ` + field4 + `, COUNT(score) numReviews
                    FROM reviews r, album a
                    WHERE r.albumid = a.albumid
                    GROUP BY ` + field1 + `, ` + field2 + `, ` + field3 + `, `+ field4 +` WITH ROLLUP;`;
        }
        else{
            query = `SELECT ` + field1 + `, ` + field2 + `, `+ field3 + `, ` + field4 + `, COUNT(score) numReviews
                    FROM reviews r, album a, time t
                    WHERE r.albumid = a.albumid AND t.timeid = r.timeid
                    GROUP BY ` + field1 + `, ` + field2 + `, ` + field3 + `, `+ field4 +` WITH ROLLUP;`;
        }
        
        console.log(query);
        db.query(query, (err, output) => {
            if (err) res.redirect('/');
            
            res.render('rollup.ejs', { // Pass data to front end
                title: "Rollup Query", 
                result: output,
                headers: {
                    field1: field1,
                    field2: field2,
                    field3: field3,
                    field4: field4,
                }
            });
        });
    },
}