/* Import statements */
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const port = 8080; 

const { loadRollup, queryRollup } = require('./routes/rollup');
const { loadDrilldown, queryDrilldown } = require('./routes/drilldown');
const { loadDice, queryDice } = require('./routes/dice');
const { loadSlice, querySlice } = require('./routes/slice');

// Don't forget to create the db here!
// GCLOUD Deployment DB connection
// const db = mysql.createConnection({
//     user: process.env.CLOUD_SQL_USERNAME,
//     password: process.env.CLOUD_SQL_PASSWORD,
//     database: process.env.CLOUD_SQL_DATABASE_NAME,
//     socketPath: `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
// });
// Local DB connection with CLOUD SQL
// const db = mysql.createConnection({
//     host: '35.201.146.224',
//     user: 'test',
//     password: '1234',
//     port: 3306,
//     database: 'pitchfork_star',
//     multipleStatements: true
// });
// Local DB connection with Local SQL 'pitchforks_unoptimized'
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    port: 3306,
    database: 'pitchfork_star',
    multipleStatements: true
});


// Connect to the database
db.connect(err => {
    if (err) throw err;
    console.log("Connected to database!");
});

// Setting a global instance of db for easy access
global.db = db;


// Config
app.set('port', process.env.port || port); // set express to use this port
app.set('view engine', 'ejs');             // configure template engine
app.set('views', __dirname + '/views');    // view folder config
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json()); // parse formdata client
app.set('trust proxy', true);

// App routes
app.get('/', loadRollup);
app.get('/rollup', loadRollup);
app.post('/rollup/getquery', queryRollup);
app.get('/drilldown', loadDrilldown);
app.post('/drilldown/getquery', queryDrilldown);
app.get('/dice', loadDice);
app.post('/dice/getquery', queryDice);
app.get('/slice', loadSlice);
app.post('/slice/getquery', querySlice);


// Set the port the app will listen on
app.listen(port, () => {
    console.log(`Proceed to http://localhost:${port} to view app.`);
});