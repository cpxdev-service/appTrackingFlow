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

router.get("/all", async (req, res, next) => {
    const token = verifyToken(req);
    if (token == null) {
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

        const docs = await collection.find({ 'user.userId': token.userId }).toArray();
        res.status(200).json({
            status: true,
            auth: true,
            response: docs
        });
    } catch (ex) {
        res.status(500).json({
            status: false,
            auth: true,
            message: ex.message
        });
    }
});

router.post("/flow/create", async (req, res, next) => {
    const token = verifyToken(req);
    if (token === null) {
        res.status(401).json({
            status: true,
            auth: false
        });
        return;
    }
    const appId = uuidv4();
    const app = {
        "appId": appId,
        "appName": req.body.title,
        "appDesc": req.body.desc,
        "apiKey": generateToken({
            appId: appId,
            userId: token.userId
        }, process.env.apiKey, '1y'),
        "steps": 0,
        "jobs": 0,
        "created": new Date(),
        "updated": new Date(),
        "webHook": {
            "enabled": false,
            "url": ""
        },
        "active": false,
        "pause": false,
        "user": token
    }
    try {
        await client.connect();

        const db = client.db('appFlow');
        const collection = db.collection('appInstance');

        const docs = await collection.insertOne(app);
        res.status(200).json({
            status: true,
            auth: true,
            response: docs
        });
    } catch (ex) {
        res.status(500).json({
            status: false,
            auth: true,
            message: ex.message
        });
    }
});

module.exports = router;