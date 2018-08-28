const mysql = require('mysql');
const config = require('./config');

const pool = mysql.createPool({
    host: config.database.HOST,
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE
});

// mysql query
let query = function(sql, values) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection) {
            if(err) {
                reject(err)
            }else {
                connection.query(sql, values, (err, rows) => {
                    if(err) {
                        reject(err)
                    }else {
                        resolve(rows)
                    }
                    connection.release()
                })
            }
        })  
    })
}

// insert into files
const insertFiles = (files) => {
    const sql = 'INSERT INTO nodesql.file set files=?;'
    return query(sql, files);
}

module.exports = {
    query,
    insertFiles
}