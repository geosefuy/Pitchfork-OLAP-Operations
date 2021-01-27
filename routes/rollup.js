const performance = require('perf_hooks').performance;
module.exports = {
    loadRollup: (req, res) => {
        res.render('rollup.ejs', { // Pass data to front end
            title: "Rollup Query",
            result1: false,
            result2: false,
            time: false
        });
    },
    oneQuery1: (req, res) => {
        //query here
        let score = req.body.query1;
        let query = `SELECT r.pub_year, COUNT(r.title) albums
                        FROM reviews r
                        WHERE r.score >= ` + score + `
                        GROUP BY r.pub_year
                        ORDER BY r.pub_year`;
        console.log(query);
        let t0 = performance.now();
        db.query(query, (err, output) => {
            let time = performance.now() - t0;
            if (err) res.redirect('/');
            
            res.render('one_table.ejs', { // Pass data to front end
                title: "One Table Query 1", 
                result1: output,
                result2: false,
                time: time
            });
        });
    },
    oneQuery2: (req, res) => {
        //query here
        let day1 = req.body.query2_1;
        let day2 = req.body.query2_2;
        if (day2 < day1) {
            let dum = day1;
            day1 = day2;
            day2 = dum;
        }
        // let query = `SELECT r.author_type, COUNT(r.author) authors
        //                 FROM reviews r
        //                 WHERE r.pub_weekday BETWEEN ` + day1 + ` AND ` + day2 + ` AND r.author_type <> ""
        //                 GROUP BY r.author_type`;
        // normalized query
        let query = `SELECT t.author_type, COUNT(t.author_type) authors
                    FROM reviews r, author_types t
                    WHERE r.author_type_id = t.author_type_id AND 
                        t.author_type <> "" AND 
                        r.pub_weekday BETWEEN ` + day1 + ` AND ` + day2 + `
                    GROUP BY t.author_type`;

        console.log(query);
        let t0 = performance.now()
        db.query(query, (err, output) => {
            let time  = performance.now() - t0;
            if (err) res.redirect('/'); 

            res.render('one_table.ejs', { // Pass data to front end
                title: "One Table Query 2", 
                result1: false,
                result2: output,
                time: time
            });
        });
    },
}