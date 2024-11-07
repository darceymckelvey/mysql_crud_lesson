'use strict'; 

const express = require("express");
const mysql = require("mysql2");
const session = require ("express-session");
const MySQLStore = require("express-mysql-session")(session);
require('dotenv').config();

const userData = {
    fullname: "Darcey Mckelvey",
    username: "rickybobby",
    password: 1234567
};

const app = express();

app.use(express.json({}));
app.use(express.urlencoded({
    extended: true
}));

const options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Anim8ors123!!!',
    database: 'db_sessions'
};

const sessionConnection = mysql.createConnection(options);
// this is where const or let would not work, need to use var keyword here
var sessionStore = new MySQLStore({
    expiration: 10800000,
    createDatabaseTable: true,
    schema: {
        tableName: 'tbl_sessions',
        colunmNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
}, sessionConnection);

app.use( session ({
    key: 'keyin',
    secret: 'my secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: true
}));

app.get('/login', (req, res) => {
    const { username, password } = req.body;
    if(username != userData.username || password != userData.password) {
        return res.status(401).json({
            error: true,
            message: 'Username or password does not match'
        });
    } else {
        req.session.userinfo = userData.fullname;
        res.send('Landing success!');
    }      
});

app.use('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(!err) {
            res.send('Logged out!');
        }
    })
});

app.use('/', (req, res) => {
    if(req.session.userinfo) {
        res.send('Hello ' + req.session.userinfo + ' welcome')
    } else {
        res.send('not logged in');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server is running at port ' + PORT);
});