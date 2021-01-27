const performance = require('perf_hooks').performance;
module.exports = {
    loadDice: (req, res) => {
        res.render('dice.ejs', { // Pass data to front end
            title: "Dice Query",
            result: false,
        });
    },
    queryDice: (req, res) => {
        //query here
        let field1 = req.body.field1; //dice 2 fields
        let field2 = req.body.field2;
        let query = `CREATE TEMPORARY TABLE diceCube
                        SELECT year, author, author_type, pub_weekday, COUNT(score) reviewCount
                        FROM reviews r, albums a, authors au, time t
                        WHERE r.albumid = a.albumid AND r.authorid = au.authorid AND r.timeid = t.timeid
                        GROUP BY year, author, author_type, pub_weekday
                        WITH ROLLUP
                        
                        UNION
                        
                        SELECT year, author, author_type, pub_weekday, COUNT(score) reviewCount
                        FROM reviews r, albums a, authors au, time t
                        WHERE r.albumid = a.albumid AND r.authorid = au.authorid AND r.timeid = t.timeid
                        GROUP BY author, author_type, pub_weekday, year
                        WITH ROLLUP
                        
                        UNION
                        
                        SELECT year, author, author_type, pub_weekday, COUNT(score) reviewCount
                        FROM reviews r, albums a, authors au, time t
                        WHERE r.albumid = a.albumid AND r.authorid = au.authorid AND r.timeid = t.timeid
                        GROUP BY author_type, pub_weekday, year, author
                        WITH ROLLUP
                        
                        UNION
                        
                        SELECT year, author, author_type, pub_weekday, COUNT(score) reviewCount
                        FROM reviews r, albums a, authors au, time t
                        WHERE r.albumid = a.albumid AND r.authorid = au.authorid AND r.timeid = t.timeid
                        GROUP BY pub_weekday, year, author, author_type
                        WITH ROLLUP
                        
                        UNION
                        
                        SELECT year, NULL, author_type, NULL, COUNT(score) reviewCount
                        FROM reviews r, albums a, authors au, time t
                        WHERE r.albumid = a.albumid AND r.authorid = au.authorid AND r.timeid = t.timeid
                        GROUP BY year, author_type
                        
                        UNION
                        
                        SELECT NULL, author, NULL, pub_weekday, COUNT(score) reviewCount
                        FROM reviews r, albums a, authors au, time t
                        WHERE r.albumid = a.albumid AND r.authorid = au.authorid AND r.timeid = t.timeid
                        GROUP BY author, pub_weekday
                        
                        ORDER BY
                        year IS NULL, year,
                        author IS NULL, author,
                        author_type IS NULL, author_type,
                        pub_weekday IS NULL, pub_weekday;
                        
                        SELECT year, author, author_type, pub_weekday, reviewCount
                        FROM diceCube
                        WHERE author_type = ` + field1 + ` AND pub_weekday = ` + field2 + `;
                        
                        DROP TABLE diceCube;`;
        // let query = `SELECT year, author, author_type, pub_weekday, reviewCount
        //                 FROM diceCube
        //                 WHERE author_type = ` + field1 + ` AND pub_weekday = ` + field2 + `;`;
        console.log(query);
        db.query(query, (err, output) => {
            if (err) res.redirect('/');

            res.render('dice.ejs', { // Pass data to front end
                title: "Dice Query", 
                result: output,
            });
        });
    },
}