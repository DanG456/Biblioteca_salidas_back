const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const cors = require('cors');
//routes
const login = require('./src/login/login')

const port = process.env.PORT || 5000;
app.use(cors({
  origin: process.env.FRONT_PORT || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
}))
app.use(bodyParser.json());

app.get('/',(req,res) => res.send('Inicio'));

app.route('/login').post(login.doLogin)


app.listen(port, () =>
  console.log(`Corriendo backend en el puerto: ${port}`)
);
module.exports = {app};