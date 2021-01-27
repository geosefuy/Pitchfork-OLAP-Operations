# stadvdb-mco1

## Note: Make sure to set Safe Updates off before connecting to the local instance since the SQL file requires UPDATE and DELETE statements
1. Go to MySQL Workbench
2. Connect to localhost instance
3. Execute the following commands
```
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '1234';
flush privileges;
```
4. Open and run new_pitchfork.sql

## Web Application
1. Install dependencies with `npm install`

2. Run `node app.js`
