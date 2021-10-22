const express = require('express');
const path = require('path');
require('dotenv').config();

//DB Config 
// Opción 1
// const { dbConnection } = require('./database/config');
// dbConnection();
// Opción 2
require('./database/config').dbConnection();

// App de Express
const app = express();

// lectura y parseo del Body
app.use(express.json());

// Node Server
const server = require('http').createServer(app);
module.exports.io = require('socket.io')(server);
require('./sockets/socket');

// Path público
const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));


// Mis Rutas
app.use('/api/login', require('./routes/auth'));

server.listen(process.env.PORT, (err) => {

    if (err) throw new Error(err);

    console.log('Servidor corriendo en puerto', process.env.PORT);

});