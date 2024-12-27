const {Client} = require('pg');

const getWorkingDatabase = () => process.env.MYSQL_DATABASE || 'biblioteca_salidas';

const getMySqlUser = () => process.env.MYSQL_USER || 'postgres';

const getMySqlPassword = () => process.env.MYSQL_PASSWORD || 'Alvmevaleverga12345%';

const getMySqlHost = () => process.env.MYSQL_HOST || 'localhost';

const connectionData = {
  connectionLimit: 10,
  host: getMySqlHost(),
  user: getMySqlUser(),
  password: getMySqlPassword(),
  database: getWorkingDatabase(),
  port: 5432
};

const client = new Client(connectionData)
module.exports = client;