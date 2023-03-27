const mysql = require("mysql2");
require('dotenv').config();

const db = mysql.createConnection(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: "localhost",
        PORT: 3001,
    },
    console.log("Successfully connected to the company database!")
);