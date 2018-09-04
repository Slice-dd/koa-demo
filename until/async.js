const fs = require('fs');
const getRawBody = require('raw-body');
const contentType = require('content-type')

// async read file with promise
const readFiles = (...path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(...path, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

/**
 * get charset
 * @param {Object} req
 */
const encoding = (req) => contentType.parse(req).parameters.charset;

/**
 * raw-body arguments
 * @param {Object} req 
 * @param  {...Object} opts 
 */
const readBufferData = (req, ...opts) => {
    return new Promise((resolve, reject) => {
        getRawBody(req, { ...opts, encoding: encoding(req) }, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

module.exports = {
    readFiles,
    readBufferData,
    encoding
};