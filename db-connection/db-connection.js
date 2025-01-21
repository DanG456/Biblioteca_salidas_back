const dotenv = require('dotenv')
const {Client} = require('pg');

dotenv.config()
const clientQuery = async (query) => {
  try{
    const client = new Client(
      {host: process.env.PG_HOST,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      port: 5432}
    )
    await client.connect()
    const now = await client.query(query)
    await client.end()
    return now
  }catch(error){
    console.log(error)
    console.log('error en seccion de conexion')
  }
}

module.exports = {clientQuery};