'use strict';

const mysql = require('mysql');

const db_host = process.env.DBHOST || 'localhost';
const db_user = process.env.DBUSER || 'root';
const db_port = process.env.DBPORT || 3306;
const db_database = process.env.DBDATABASE || 'friendshipdb';
const db_password = process.env.DBPASSWORD || 'Singpower';

function _createConnection(){
    var connection = mysql.createConnection({
        host     : db_host,
        port     : db_port,
        user     : db_user,
        password : db_password,
        database : db_database
    });
    return connection;
}

function _executeSql(sql, values) {
    var tempconnection = _createConnection();
    tempconnection.connect();

    return new Promise((resolve, reject) => {
        tempconnection.query(sql, values, function (err, results) {
            if (err) reject(err);
            else resolve(results);
        });
        tempconnection.end();
    });
}

module.exports = {
	executeSql: _executeSql
}
