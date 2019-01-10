const express = require('express');
const session = require('express-session');
const massive = require('massive');
const { json } = require('body-parser');
require('dotenv').config();

const {usersOnly, adminsOnly} = require('./middleware/authMiddleware')
const {register, login,logout} = require('./controllers/authController');
const {dragonTreasure, getUserTreasure, addUserTreasure, getAllTreasure} = require('./controllers/treasureController');
const {CONNECTION_STRING} = process.env;
const {SESSION_SECRET} = process.env;

massive(CONNECTION_STRING)
.then(db => {
    app.set('db', db);
    console.log('Database Connected');
}).catch(err => console.log(err));

const app = express();
const port = 4000;

app.use(json());
app.use(session( {
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: false
}))

app.post('/auth/register', register);
app.post('/auth/login', login);
app.get('/auth/logout', logout);
app.get('/api/treasure/dragon', dragonTreasure);
app.get('/api/treasure/user', usersOnly, getUserTreasure)
app.get('/api/treasure/all', usersOnly, adminsOnly, getAllTreasure);
app.post('/api/treasure/user', usersOnly, addUserTreasure)


app.listen(port, () => console.log(`Listening on Port ${port}`));