const express = require("express");
const router = express.Router();
const uuid4 = require("uuid4");

let data = [];

router.get("/", (req, res) => {
  res.json({
    status: true,
    response: data,
  });
});

router.post("/create", (req, res) => {
  try {
    let reqs = req.body;
    reqs.id = uuid4();
    data.push(reqs);
    res.json({
      status: true,
      response: reqs,
    });
  } catch (error) {
    res.json({
      status: false,
      message: error,
    });
  }
});

router.put("/update/:id", (req, res) => {
  try {
    const currentid = req.params.id;
    if (data.filter((x) => x.id === currentid).length == 0) {
      res.json({
        status: false,
        message: "This ID not found",
      });
      return;
    }
    let reqs = req.body;
    reqs.id = currentid;
    data[data.findIndex((x) => x.id === currentid)] = reqs;
    res.json({
      status: true,
      response: reqs,
    });
  } catch (error) {
    res.json({
      status: false,
      message: error,
    });
  }
});

router.delete("/delete/:id", (req, res) => {
  try {
    const currentid = req.params.id;
    if (data.filter((x) => x.id === currentid).length == 0) {
      res.json({
        status: false,
        message: "This ID not found",
      });
      return;
    }
    const dataRemoved = data.filter((el) => {
      return el.id !== currentid;
    });
    data = dataRemoved;
    res.json({
      status: true,
    });
  } catch (error) {
    res.json({
      status: false,
      message: error,
    });
  }
});

module.exports = router;
