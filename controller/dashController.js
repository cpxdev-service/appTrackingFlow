const express = require("express");
const router = express.Router()
const { generateToken, verifyToken } = require("../service/token");
const { verifyCf } = require("../service/cfCheck");
const { v4: uuidv4 } = require('uuid');

const { MongoClient, ServerApiVersion } = require("mongodb");
const client = new MongoClient(process.env.DB, {
    serverApi: {
        version: ServerApiVersion.v1,
    },
});

router.get("/status", async (req, res, next) => {
    const token = verifyToken(req);
    if (token === null) {
        res.status(401).json({
            status: true,
            auth: false
        });
        return;
    }

    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        res.status(200).json({
            status: true,
            auth: true
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message,
        });
    }
});

module.exports = router;