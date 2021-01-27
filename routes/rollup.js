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
    queryRollup: (req, res) => {
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
}