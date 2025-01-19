require('dotenv').config()
const {Client} = require('pg');

const getWorkingDatabase = () => process.env.PG_DATABASE;

const getMySqlUser = () => process.env.PG_USER;

const getMySqlPassword = () => process.env.PG_PASSWORD;

const getMySqlHost = () => process.env.PG_HOST;

const connectionData = {
  host: getMySqlHost(),
  user: getMySqlUser(),
  password: getMySqlPassword(),
  database: getWorkingDatabase(),
  port: 5432
};

async function clientQuery(query){
  console.log('query recibida: ',query)
  const client = new Client(connectionData)
  //console.log('conexion con el cliente: ',client) //esta si la mostro
  await client.connect()
  const now = await client.query(query)
  console.log('Conexion completada, mostrando const now: ',now) //esta no la mostro
  await client.end();

  return now
}

module.exports = {clientQuery};