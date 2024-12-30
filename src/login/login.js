const queries = require('./login-queries');
const bcrypt = require('bcrypt');
const client = require('../../db-connection/db-connection');
const jwt = require('jsonwebtoken');
//const signSecret = process.env.SIGN_SECRET || '';
const {
  sendMySQLError,
  sendError,
  sendSuccess
} = require('../mixins/response-mixins');
const toNodePassword = password => password.replace('$2y$', '$2a$');

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


module.exports = {
    doLogin
}