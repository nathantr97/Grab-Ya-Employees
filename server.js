
const db= require("./db/connection");
const express = require("express");
const appTrigger = require("./index");
const PORT = process.env.PORT || 8000;
const app = express();

app.use(express.urlencoded({ extended: false}));
app.use(express.json());

app.use((req, res) => {
    res.status(404).end();
});

db.connect(err => {
    if (err) throw err;
    console.log("database connected.");
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    appTrigger();
    });
});