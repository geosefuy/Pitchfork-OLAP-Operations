const performance = require('perf_hooks').performance;
module.exports = {
    loadSlice: (req, res) => {

        let query = `SELECT DISTINCT label
                        FROM artist ar
                        ORDER BY label
                        LIMIT 4000`
        
        db.query(query, (err, labels) => {
            if (err) res.redirect('/');

            res.render('slice.ejs', { // Pass data to front end
                title: "Slice Query",
                labels: labels,
                result: false,
            });
        })
    },
    querySlice: (req, res) => {
        //query here
        let field1 = req.body.field1; // slice 1 field
        let query = `CREATE TEMPORARY TABLE sliceCube
                        SELECT label, year, artist, AVG(score) avgScore
                        FROM reviews r, album a, artist ar
                        WHERE r.albumid = a.albumid AND r.artistid = ar.artistid
                        GROUP BY label, year, artist
                        WITH ROLLUP

                        UNION

                        SELECT label, year, artist, AVG(score) avgScore
                                FROM reviews r, album a, artist ar
                        WHERE r.albumid = a.albumid AND r.artistid = ar.artistid
                        GROUP BY year, artist, label
                        WITH ROLLUP

                        UNION

                        SELECT label, year, artist, AVG(score) avgScore
                                FROM reviews r, album a, artist ar
                        WHERE r.albumid = a.albumid AND r.artistid = ar.artistid
                        GROUP BY artist, label, year
                        WITH ROLLUP

                        ORDER BY
                        label IS NULL, label,
                        year IS NULL, year,
                                artist IS NULL, artist;`;

        console.log(query);
        db.query(query, (err) => {
            if (err) res.redirect('/'); 

            let query = `SELECT DISTINCT label
                        FROM artists ar
                        ORDER BY label
                        LIMIT 4000`
            
            db.query(query, (err, labels) => {
                if (err) res.redirect('/');

                let query = `SELECT label, year, artist, avgScore
                                FROM sliceCube
                                WHERE label = '` + field1 + `';`
                db.query(query, (err, output) => {
                    if (err) res.redirect('/');
        
                    res.render('slice.ejs', { // Pass data to front end
                        title: "Slice Query",
                        labels: labels,
                        result: output,
                    });

                    let query = `DROP TABLE sliceCube;`
                    db.query(query, (err) => {
                        if (err) res.redirect('/');
                    });
                });
            });
        });
    },
}