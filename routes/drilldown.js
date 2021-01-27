const performance = require('perf_hooks').performance;
module.exports = {
    loadDrilldown: (req, res) => {
        res.render('drilldown.ejs', { // Pass data to front end
            title: "Drill-down Query",
            result1: false,
            result2: false,
            time: false
        });
    },
    queryDrilldown: (req, res) => {
        //query here
        let year1 = req.body.query1_1;
        let year2 = req.body.query1_2;
        if (year2 < year1) {
            let dum = year1;
            year1 = year2;
            year2 = dum;
        }
        // let query = `SELECT r.author, COUNT(r.author) reviewCount
        //                 FROM reviews r, years y
        //                 WHERE r.reviewid = y.reviewid AND
        //                     y.year BETWEEN ` + year1 + ` AND ` + year2 + `
        //                 GROUP BY r.author
        //                 ORDER BY COUNT(r.author) DESC
        //                 LIMIT 3`;
        // normalized query
        let query = `SELECT a.author, COUNT(a.author) reviewCount
                        FROM reviews r, years y, authors a
                        WHERE r.reviewid = y.reviewid AND
                            a.authorid = r.authorid 
                            AND
                            y.year BETWEEN ` + year1 + ` AND ` + year2 + `
                        GROUP BY a.author
                        ORDER BY COUNT(a.author) DESC
                        LIMIT 3`;
        console.log(query);
        let t0 = performance.now();
        db.query(query, (err, output) => {
            let time = performance.now() - t0;
            if (err) res.redirect('/'); 

            res.render('two_table.ejs', { // Pass data to front end
                title: "Two Table Query 1", 
                result1: output,
                result2: false,
                time: time
            });
        });
    },
}