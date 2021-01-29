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
        let field1_1 = req.body.field1_1; //dice 6 fields
        let field1_2 = req.body.field1_2;
        let field1_3 = req.body.field1_3;
        let field2_1 = req.body.field2_1;
        let field2_2 = req.body.field2_2;
        let field2_3 = req.body.field2_3;
        let query = `CREATE TEMPORARY TABLE diceCube
                        SELECT year, author, author_type, pub_weekday, COUNT(score) reviewCount
                                FROM reviews r, album a, author au, time t
                        WHERE r.albumid = a.albumid AND r.authorid = au.authorid AND r.timeid = t.timeid
                        GROUP BY year, author, author_type, pub_weekday
                        WITH ROLLUP
                        
                        UNION
                        
                        SELECT year, author, author_type, pub_weekday, COUNT(score) reviewCount
                                FROM reviews r, album a, author au, time t
                        WHERE r.albumid = a.albumid AND r.authorid = au.authorid AND r.timeid = t.timeid
                        GROUP BY author, author_type, pub_weekday, year
                        WITH ROLLUP
                        
                        UNION
                        
                        SELECT year, author, author_type, pub_weekday, COUNT(score) reviewCount
                                FROM reviews r, album a, author au, time t
                        WHERE r.albumid = a.albumid AND r.authorid = au.authorid AND r.timeid = t.timeid
                        GROUP BY author_type, pub_weekday, year, author
                        WITH ROLLUP
                        
                        UNION
                        
                        SELECT year, author, author_type, pub_weekday, COUNT(score) reviewCount
                                FROM reviews r, album a, author au, time t
                        WHERE r.albumid = a.albumid AND r.authorid = au.authorid AND r.timeid = t.timeid
                        GROUP BY pub_weekday, year, author, author_type
                        WITH ROLLUP
                        
                        UNION
                        
                        SELECT year, NULL, author_type, NULL, COUNT(score) reviewCount
                                FROM reviews r, album a, author au, time t
                        WHERE r.albumid = a.albumid AND r.authorid = au.authorid AND r.timeid = t.timeid
                        GROUP BY year, author_type
                        
                        UNION
                        
                        SELECT NULL, author, NULL, pub_weekday, COUNT(score) reviewCount
                                FROM reviews r, album a, author au, time t
                        WHERE r.albumid = a.albumid AND r.authorid = au.authorid AND r.timeid = t.timeid
                        GROUP BY author, pub_weekday
                        
                        ORDER BY
                        year IS NULL, year,
                        author IS NULL, author,
                                author_type IS NULL, author_type,
                                pub_weekday IS NULL, pub_weekday;`
                                
        db.query(query, (err) => {
            if (err) res.redirect('/');

            query = `SELECT year, author, author_type, pub_weekday, reviewCount
                        FROM diceCube
                        WHERE (author_type = '` + field1_1 + `'` + (field1_2 == "blank1_1" ? `` : ` OR author_type = '` + field1_2 + `'`)
                         + (field1_3 == "blank1_2" ? `` : ` OR author_type = '` + field1_3 + `'`) + `)
                        AND (pub_weekday = ` + field2_1 + `` + (field2_2 == "blank2_1" ? `` : ` OR pub_weekday = ` + field2_2) 
                         + (field2_3 == "blank2_2" ? `` : ` OR pub_weekday = ` + field2_3) + `);`

            db.query(query, (err, output) => {
                console.log(query)
                if (err) res.redirect('/');
                res.render('dice.ejs', { // Pass data to front end
                    title: "Dice Query", 
                    result: output,
                });
                
                query = `DROP TABLE diceCube;`;

                db.query(query, (err) => {
                    console.log(query)
                    if (err) res.redirect('/');
                });
            });
        });
    },
}