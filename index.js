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
  max: 30, // maximum number of requests allowed in the windowMs
  message: {
    status: false,
    message: "Too many requests, please try again later.",
  },
});

const auth = require("./controller/authController");

const app = express();
const PORT = 5999;

// Serve static files from React app
app.use(express.static(path.join(__dirname, "/clientapp/dist")));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use("/api/*", limiter);
app.use("/api/*", cors());

// API routes
app.post("/api/status", async (req, res) => {
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
app.use("/api/auth", auth);

// Serve React frontend for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/clientapp/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
