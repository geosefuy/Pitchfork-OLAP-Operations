const performance = require('perf_hooks').performance;
module.exports = {
    loadSlice: (req, res) => {
        res.render('slice.ejs', { // Pass data to front end
            title: "Slice Query",
            results: false,
            time: false
        });
    },
    fourSixQuery: (req, res) => {
        //query here
        let month = req.body.query_1;
        let year = req.body.query_2;
        let yearminus = (Number(year) - 1).toString()
        let query = `SELECT r.title, r.artist, l.label, g.genre, y.year, r.score, r.pub_date
                        FROM reviews r
                        JOIN labels l
                        ON r.reviewid = l.reviewid 
                        JOIN genres g
                        ON r.reviewid = g.reviewid 
                        JOIN years y
                        ON r.reviewid = y.reviewid 
                        WHERE r.pub_month = ` + month + ` 
                        AND r.pub_year = ` + year + ` 
                        AND y.year = ` + year + ` 
                        AND r.score < (
                            SELECT AVG(r2.score)
                            FROM reviews r2
                            JOIN years y2
                            ON r2.reviewid = y2.reviewid
                            WHERE y2.year = ` + yearminus + `
                            GROUP BY y2.year
                        )
                        ORDER BY r.score DESC
                        LIMIT 10`;
        console.log(query);
        let t0 = performance.now();
        db.query(query, (err, output) => {
            let time = performance.now() - t0;
            if (err) res.redirect('/'); 

            res.render('four_six_table.ejs', { // Pass data to front end
                title: "Four to Six Table Query", 
                results: output,
                time: time
            });
        });
    },
}