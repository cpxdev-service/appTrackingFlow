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

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  message: {
    status: false,
    message: "Too many requests, please try again later.",
  },
});

const auth = require("./controller/authController");
const apppath = require("./controller/applistController");

const app = express();
const PORT = process.env.PORT || 5999;
const apipath = ["/v1/*"]

// Serve static files from React app
app.use(express.static(path.join(__dirname, "./clientapp/dist")));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
apipath.forEach(element => {
  app.use(element, limiter);
  app.use(element, cors());
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
app.use("/service/app", apppath);

// Serve React frontend for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./clientapp/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
