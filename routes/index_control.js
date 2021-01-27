module.exports = {
    createIndexAndLoadPage: (req, res) => {
        let query = 
            `CREATE INDEX artists_index ON artists (reviewid);
             CREATE INDEX genres_index ON genres (reviewid);
             CREATE INDEX reviews_index ON reviews (reviewid);
             CREATE INDEX labels_index ON labels (reviewid);
             CREATE INDEX years_index ON years (reviewid);`

        db.query(query, (err, output) => {
            if (err) {
                res.render('error_create.ejs', {
                    title: "Creating Indices"
                })
            }
            
            res.render('one_table.ejs', { // Pass data to front end
                title: "One Table Query", 
                result1: false,
                result2: false,
                time: false
            });
        });
    },

    dropIndexAndLoadPage: (req, res) => {
        let query = 
            `ALTER TABLE artists DROP INDEX artists_index;
             ALTER TABLE genres DROP INDEX genres_index;
             ALTER TABLE reviews DROP INDEX reviews_index;
             ALTER TABLE labels DROP INDEX labels_index;
             ALTER TABLE years DROP INDEX years_index;`

        db.query(query, (err, output) => {
            if (err) {
                res.render('error_drop.ejs', {
                    title: "Dropping Indices"
                })
            }
            
            res.render('one_table.ejs', { // Pass data to front end
                title: "One Table Query", 
                result1: false,
                result2: false,
                time: false
            });
        });
    }
}