# stadvdb-mco1

## Note: Make sure to set Safe Updates off before connecting to the local instance since the SQL file requires UPDATE and DELETE statements
1. Go to MySQL Workbench and Click Edit
2. Click on Preferences
3. Go to SQL Editor section
4. Uncheck Safe Updates (rejects UPDATEs and DELETEs with no restrictions)
5. Connect to localhost instance
6. Execute the following commands
```
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '1234';
flush privileges;
```
7. Open and run pitchfork_unoptimized.sql

## Web Application
1. Install dependencies with `npm install`

3. Run `node app.js`
