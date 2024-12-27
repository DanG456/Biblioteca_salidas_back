const queries = require('../login/login-queries');
const client = require('../../db-connection/db-connection');

const sendError = (res, code, msg, user, log, responseCode) => {
  if (process.env.DEBUG) console.log({ code, msg, log });
  if (
    code == 200 ||
    code == 452 ||
    code == 450 ||
    code == 467 ||
    code == 471 ||
    code == 451
  ) {
    client.query(queries.loginLog(user, code, msg), (err, loginLogResult) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`${msg}`);
        client.query(queries.generalLoginLog(), (err, generalLoginResult) => {
          if (err) {
            console.error(err);
          }
        });
      }
    });
  }
  return res.status(responseCode ? responseCode : 200).send({
    error: {
      code,
      msg,
      log
    }
  });
};

const sendMySQLError = (res, msg) => sendError(res, 501, 'SQL Error', 500, msg);

const sendSuccess = (res, msg) =>
  res.send({
    success: msg
  });
module.exports = { sendError, sendMySQLError, sendSuccess };