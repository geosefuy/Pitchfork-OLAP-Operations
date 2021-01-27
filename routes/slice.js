const performance = require('perf_hooks').performance;
module.exports = {
    loadSlice: (req, res) => {
        // res.render('slice.ejs', { // Pass data to front end
        //     title: "Slice Query",
        //     result: false,
        // });

        let query = `SELECT DISTINCT label
                        FROM artists ar
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
        let field1 = req.body.field1; // slice 1 fields
        let yearminus = (Number(year) - 1).toString()
        let query = `CREATE TEMPORARY TABLE sliceCube
                        SELECT label, year, artist, AVG(score) avgScore
                        FROM reviews r, albums a, artists ar
                        WHERE r.albumid = a.albumid AND r.artistid = ar.artistid
                        GROUP BY label, year, artist
                        WITH ROLLUP
                        
                        UNION
                        
                        SELECT label, year, artist, AVG(score) avgScore
                        FROM reviews r, albums a, artists ar
                        WHERE r.albumid = a.albumid AND r.artistid = ar.artistid
                        GROUP BY year, artist, label, 
                        WITH ROLLUP
                        
                        UNION
                        
                        SELECT label, year, artist, AVG(score) avgScore
                        FROM reviews r, albums a, artists ar
                        WHERE r.albumid = a.albumid AND r.artistid = ar.artistid
                        GROUP BY artist, label, year
                        WITH ROLLUP
                        
                        ORDER BY
                        label IS NULL, label,
                        year IS NULL, year,
                        artist IS NULL, artist;
                        
                        SELECT label, year, artist, avgScore
                        FROM sliceCube
                        WHERE label = ` + field1 + `;`;
        // let query = `SELECT label, year, artist, avgScore
        //                 FROM sliceCube
        //                 WHERE label = ` + field1 + `;`;
        console.log(query);
        db.query(query, (err, output) => {
            if (err) res.redirect('/'); 

            // res.render('slice.ejs', { // Pass data to front end
            //     title: "Slice Query", 
            //     result: output,
            // });

            let query = `SELECT DISTINCT label
                        FROM artists ar
                        ORDER BY label
                        LIMIT 4000`
            
            db.query(query, (err, labels) => {
                if (err) res.redirect('/');
    
                res.render('slice.ejs', { // Pass data to front end
                    title: "Slice Query",
                    labels: labels,
                    result: output,
                });
            })
        });
    },
}