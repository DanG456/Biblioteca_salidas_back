const crypto = require('crypto')
const { buffer } = require('stream/consumers')
const pool = require('../../db-connection/db-connection')

const createResetToken = () => {
    new Promise((resolve,reject) => 
    crypto.randomBytes(20,(err,buffer) => 
    err
    ? reject({msg: 'Error creating token', code: 465})
    : resolve(buffer.toString('hex'))
    )
    )
}

const promiseQuery = (sqlQuery, verbose = false) =>
    new Promise((resolve, reject) =>{
        if(verbose){
            console.log(sqlQuery)
        }
        return pool.query(sqlQuery, (err, queryResult) => {
            return err ? reject(err.sqlMessage) : resolve(queryResult);
        })
    })

module.exports = {
    createResetToken,
    promiseQuery
}