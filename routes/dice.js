const performance = require('perf_hooks').performance;
module.exports = {
    loadDice: (req, res) => {
        res.render('dice.ejs', { // Pass data to front end
            title: "Dice Query",
            result1: false,
            result2: false,
            result2_opt: false,
            time: false
        });
    },
    queryDice: (req, res) => {
        //query here
        let year = req.body.query1;
        let query = `SELECT y.year, g.genre, ROUND(AVG(r.score), 2) avgScore, MAX(r.score) maxScore, MIN(r.score) minScore
                        FROM reviews r 
                        JOIN years y 
                        ON r.reviewid = y.reviewid
                        JOIN genres g
                        ON r.reviewid = g.reviewid 
                        WHERE year = ` + year + `
                        GROUP BY y.year, g.genre`;
        console.log(query);
        let t0 = performance.now();
        db.query(query, (err, output) => {
            let time = performance.now() - t0;
            if (err) res.redirect('/');

            res.render('three_table.ejs', { // Pass data to front end
                title: "Three Table Query 1", 
                result1: output,
                result2: false,
                result2_opt: false,
                time: time
            });
        });
    },
}