const queries = require('./login-queries');
const bcrypt = require('bcrypt');
//const client = require('../../db-connection/db-connection');
const jwt = require('jsonwebtoken');
const {clientQuery} = require('../../db-connection/db-connection')
const {promiseQuery} = require('../mixins/utils')
const {createResetToken} = require('../mixins/utils')
//const signSecret = process.env.SIGN_SECRET || '';
const {
  sendMySQLError,
  sendError,
  sendSuccess
} = require('../mixins/response-mixins');
const toNodePassword = password => password.replace('$2y$', '$2a$');
const saltRounds = 5;

const doLogin = (req, res) => {
  const { user_email, user_password } = req.body;
  let stat_code = 0;
  let code_desc = '';
  return user_email && user_password
    ? client.query(queries.doLogin(user_email), (err, queryResult) => {
        return err
          ? sendMySQLError(res, err.sqlMessage)
          : queryResult.length === 0
            ? sendError(res, 452, 'No such user', user_email)
            : queryResult[0].status === 1
              ? bcrypt
                  .compare(user_password, toNodePassword(queryResult[0].password))
                  .then(isCredentialValid => {
                    const userObject = {
                      id: queryResult[0].id,
                      email: queryResult[0].email
                    };

                    if (isCredentialValid) {
                      stat_code = 200;
                      code_desc = 'Login successful';
                      client.query(
                        queries.loginLog(user_email, stat_code, code_desc),
                        (err, loginLogResult) => {
                          if (err) {
                            console.error(err);
                          } else {
                            client.query(
                              queries.generalLoginLog(),
                              (err, generalLoginResult) => {
                                if (err) {
                                  console.error(err);
                                }
                              }
                            );
                          }
                        }
                      );
                      return sendSuccess(res, [
                        jwt.sign(userObject, signSecret),
                        getProfilePercentage(percentages),
                        userAutenticate
                      ]);
                    } else {
                      return sendError(res, 450, 'Bad credentials', user_email);
                    }
                  })
                  .then(() => client.query(queries.lastSeen(queryResult[0].id)))
                  .catch(err =>
                    sendError(res, 467, 'Error comparing token', user_email, 500, err)
                  )
              : sendError(res, 471, 'User not confirmed', user_email);
      })
    : sendError(res, 451, 'Empty Field', user_email);
};

const createAccount = (req,res) => {
  const {user_name, email, password, phone_number} = req.body
  if(!user_name|| !email || !password){
    return sendError(res,451,'Empty field')
  }
  Promise.all([bcrypt.hash(password, saltRounds),createResetToken()])
  .then(([hash,confirmToken]) => {
    const user = {
      user_name,
      email,
      password: hash,
      phone_number
    }

    return saveUser(user)
  })
  .then(([token,id]) => {
    sendSuccess(res,{msg:'Account Created!',token,id});
  })
  .catch(err =>{
    sendError(res,err.code || 500, err.msg || 'Server Error')
  })
  //console.log('user_name: ',user_name)
  //console.log('email: ',email)
  //console.log('password: ',password)
};

const saveUser = async (user) => {
  console.log('save user: ',user)
  //console.log('typeof password: ',typeof(user.password))
  //console.log('Conectado a PostgreSQL:', conn._connected); // Debe ser `true`
  try{
    const result = await clientQuery(queries.createNewUser(user))
    console.log(result)
    return result.rows[0].id
  }catch{
    console.log('De nuevo al catch')
    console.error('Error al guardar el usuario: ',err)
    err.errno == 1062
        ? reject({code: 456, msg: 'Repeated email at register'})
        : err.errno == 1065
          ? reject({code: 500, msg: 'Query was empty'})
          : reject({code: 900, msg: err.sqlMessage})
  }
  /*new Promise((resolve,reject) => {
    return conn.query(queries.createNewUser(user),(err,queryResult)=>{
      return !err
      ? resolve(queryResult.insertId)
      : err.errno == 1062
        ? reject({code: 456, msg: 'Repeated email at register'})
        : err.errno == 1065
          ? reject({code: 500, msg: 'Query was empty'})
          : reject({code: 900, msg: err.sqlMessage})
    })
  })*/
}

module.exports = {
    doLogin,
    createAccount
}