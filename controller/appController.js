const express = require("express");
const router = express.Router()
const { generateToken, verifyToken } = require("../service/token");
const { verifyCf } = require("../service/cfCheck");
const { MongoClient, ServerApiVersion } = require("mongodb");
const client = new MongoClient(process.env.DB, {
    serverApi: {
        version: ServerApiVersion.v1,
    },
});

router.get("/all", async (req, res, next) => {
    if (verifyToken(req) === null) {
        res.status(401).json({
            status: true,
            auth: false
        });
        return;
    }

    try {
        await client.connect();

        const db = client.db('appFlow');
        const collection = db.collection('appInstance');

        const docs = await collection.find({}).toArray();
        res.status(200).json({
            status: true,
            auth: true,
            response: docs
        });
    } catch (ex) {
        res.json({
            status: false,
            auth: true,
            message: ex.message
        });
    }
});

module.exports = router;