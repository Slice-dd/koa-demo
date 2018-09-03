const fs = require('fs');

// async read file with promise
const readFiles = (...path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(...path, (err, data) => {
            if(err) {
                reject(err)
            }else {
                resolve(data)
            }
        })
    })
}

module.exports = {
    readFiles
};