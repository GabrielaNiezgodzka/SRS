const express = require('express');

const db = require("./db");

const api = express.Router();

api.get("/courses", async (req, res) => {
    res.send(await db.courses().find().toArray());
});

module.exports = api;