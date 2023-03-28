const mysql = require("mysql2");
require('dotenv').config()

const db = mysql.createConnection(
    {
        host: "localhost",
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    },
    console.log("Successfully connected to the company database!")
);

module.exports =db;