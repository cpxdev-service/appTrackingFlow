const express = require("express");
const router = express.Router();
const { generateToken, verifyToken } = require("../service/token");
const { verifyCf } = require("../service/cfCheck");
const { v4: uuidv4 } = require("uuid");

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
      auth: false,
    });
    return;
  }

  try {
    await client.connect();

    const db = client.db("appFlow");
    const collection = db.collection("appInstance");

    const docs = await collection
      .find({ "user.userId": token.userId })
      .toArray();
    res.status(200).json({
      status: true,
      auth: true,
      response: docs,
    });
  } catch (ex) {
    res.status(500).json({
      status: false,
      auth: true,
      message: ex.message,
    });
  }
});

router.post("/checkquota", async (req, res, next) => {
  const token = verifyToken(req);
  if (token == null) {
    res.status(401).json({
      status: true,
      auth: false,
    });
    return;
  }

  try {
    await client.connect();

    const db = client.db("management");
    const collection = db.collection("user");

    const docs = await collection.find({ userId: token.userId }).toArray();
    res.status(200).json({
      status: true,
      auth: true,
      response: docs,
    });
  } catch (ex) {
    res.status(500).json({
      status: false,
      auth: true,
      message: ex.message,
    });
  }
});

router.post("/flow/create", async (req, res, next) => {
  const token = verifyToken(req);
  if (token == null) {
    res.status(401).json({
      status: true,
      auth: false,
    });
    return;
  }
  if (verifyCf(req) == false) {
    res.json({
      status: false,
      auth: true,
      message: "Token invalid",
    });
    return;
  }
  const appId = uuidv4();
  const app = {
    appId: appId,
    appName: req.body.title,
    appDesc: req.body.desc,
    apiKey: generateToken(
      {
        appId: appId,
        userId: token.userId,
      },
      process.env.API,
      "1y"
    ),
    steps: 0,
    jobs: 0,
    created: new Date(),
    updated: new Date(),
    webHook: {
      enabled: false,
      url: "",
    },
    active: false,
    pause: false,
    user: token,
  };
  try {
    await client.connect();

    const dbd = client.db("management");
    const collectiond = dbd.collection("user");

    const docsd = await collectiond.find({ userId: token.userId }).toArray();
    if (docsd.length === 0) {
      res.status(401).json({
        status: false,
        auth: true,
        message: "User not found",
      });
      return;
    }

    const db = client.db("appFlow");
    const collection = db.collection("appInstance");

    const docsread = await collection
      .find({ "user.userId": token.userId })
      .toArray();
    if (docsread.length >= docsd[0].appQuota) {
      res.status(403).json({
        status: false,
        auth: true,
        message:
          "You have reached the maximum number of App Flow Instances. Please buy more slots.",
      });
      return;
    }

    const docs = await collection.insertOne(app);
    res.status(200).json({
      status: true,
      auth: true,
      appId: appId,
    });
  } catch (ex) {
    res.status(500).json({
      status: false,
      auth: true,
      message: ex.message,
    });
  }
});

router.delete("/flow/delete", async (req, res, next) => {
  const token = verifyToken(req);
  if (token == null) {
    res.status(401).json({
      status: true,
      auth: false,
    });
    return;
  }
  if (verifyCf(req) == false) {
    res.json({
      status: false,
      auth: true,
      message: "Token invalid",
    });
    return;
  }
  try {
    await client.connect();

    const dbd = client.db("management");
    const collectiond = dbd.collection("user");

    const docsd = await collectiond.find({ userId: token.userId }).toArray();
    if (docsd.length === 0) {
      res.status(401).json({
        status: false,
        auth: true,
        message: "User not found",
      });
      return;
    }

    const db = client.db("appFlow");
    const dbjob = client.db("trackingFlow");

    const m = await db
      .collection("appInstance")
      .deleteOne({ appId: req.body.appId, "user.userId": token.userId });
    await db
      .collection("appTrackFlow")
      .deleteMany({ appId: req.body.appId, "user.userId": token.userId });
    await dbjob
      .collection("trackingStatus")
      .deleteMany({ appId: req.body.appId, "user.userId": token.userId });
    await dbjob
      .collection("trackingLog")
      .deleteMany({ appId: req.body.appId, "user.userId": token.userId });
    res.status(200).json({
      status: true,
      auth: true,
    });
  } catch (ex) {
    res.status(500).json({
      status: false,
      auth: true,
      message: ex.message,
    });
  }
});

module.exports = router;
