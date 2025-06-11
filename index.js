require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const { MongoClient, ServerApiVersion } = require("mongodb");
const client = new MongoClient(process.env.DB, {
  serverApi: {
    version: ServerApiVersion.v1,
  },
});

const apilimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 200,
  message: {
    status: false,
    message: "Too many requests, please try again later.",
  },
});

const limiter = rateLimit({
  windowMs: 1000, // 1 minute
  max: 30,
  message: {
    status: false,
    message: "Too many requests, please try again later.",
  },
});

const auth = require("./controller/authController");
const dash = require("./controller/dashController");
const apppath = require("./controller/appController");

const app = express();
const PORT = process.env.PORT || 5999;
const apipath = ["/v1"]
const appservicepath = ["/service"]

// Serve static files from React app
app.use(express.static(path.join(__dirname, "./clientapp/dist")));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
apipath.forEach(element => {
  app.use(element, apilimiter);
  app.use(element, cors());
});
appservicepath.forEach(element => {
  app.use(element, limiter);
});

// API routes
app.post("/service/status", async (req, res) => {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    res.json({
      status: true,
    });
  } catch (error) {
    res.json({
      status: false,
      error: error.message,
    });
  }
});
app.use("/service/auth", auth);
app.use("/service/dash", dash);
app.use("/service/app", apppath);

// Serve React frontend for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./clientapp/dist/index.html"));
});

app.disable('etag');

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
