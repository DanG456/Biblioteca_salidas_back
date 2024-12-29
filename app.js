const express = require('express');
const bodyParser = require('body-parser')
const app = express();

//routes
const login = require('./src/login/login')

const port = process.env.PORT || 5000;

app.get('/',(req,res) => res.send('Inicio'));

app.route('/back/login').post(login.doLogin)


app.listen(port, () =>
  console.log(`Corriendo backend en el puerto: ${port}`)
);
module.exports = {app};