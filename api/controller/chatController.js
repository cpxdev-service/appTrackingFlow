const express = require("express");
const router = express.Router();
const uuid4 = require("uuid4");
const axios = require("axios");
const j2c = require("json-2-csv");
const fs = require("fs");

let chatData = [];

router.post("/", (req, res) => {
  const id = uuid4();
  chatData.push({
    id: id,
    name: req.body.key,
    created_at: new Date(),
    chats: [
      {
        role: "system",
        content: req.body.key,
      },
    ],
  });
  res.json({
    status: true,
    genid: id,
  });
});

router.get("/:id", (req, res) => {
  try {
    const currentid = req.params.id;
    if (chatData.filter((x) => x.id === currentid).length == 0) {
      res.json({
        status: true,
        res: [],
      });
      return;
    }
    const prevchat = chatData.filter((x) => x.id === currentid)[0].chats;
    res.json({
      status: true,
      res: prevchat,
    });
  } catch (error) {
    res.json({
      status: false,
      message: error,
    });
  }
});

router.put("/send/:id", (req, res) => {
  try {
    const currentid = req.params.id;
    if (chatData.filter((x) => x.id === currentid).length == 0) {
      res.json({
        status: false,
        message: "This ID not found",
      });
      return;
    }
    const prevchat = chatData.filter((x) => x.id === currentid)[0].chats;
    let reqs = req.body;
    prevchat.push(reqs);
    const reqapi = JSON.stringify({
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
      messages: prevchat,
      max_tokens: null,
      temperature: 0.7,
      top_p: 0.7,
      top_k: 60,
      repetition_penalty: 1,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.together.xyz/v1/chat/completions",
      headers: {
        Authorization:
          "Bearer b18dfd92fa16877a423550281f3f3d0836e5dd42f44d753d3ce967a14d02366e",
        "Content-Type": "application/json",
      },
      data: reqapi,
    };
    axios
      .request(config)
      .then((response) => {
        if (response.data.choices.length === 0) {
          res.json({
            status: false,
            message: "Chatbot is not recongize.",
          });
          return;
        }
        prevchat.push({
          role: "assistant",
          content: response.data.choices[0].message.content,
        });
        chatData[chatData.findIndex((x) => x.id === currentid)].chats =
          prevchat;
        res.json({
          status: true,
          res: prevchat,
        });
      })
      .catch((error) => {
        res.json({
          status: false,
          message: error,
        });
      });
  } catch (error) {
    res.json({
      status: false,
      message: error,
    });
  }
});

router.get("/export/:id", (req, res) => {
  try {
    const currentid = req.params.id;
    if (chatData.filter((x) => x.id === currentid).length == 0) {
      res.json({
        status: false,
        message: "This ID not found",
      });
      return;
    }
    const prevchat = chatData.filter((x) => x.id === currentid)[0].chats;
    const chatexport = [];

    let filename = "";
    prevchat.forEach((item, index, arr) => {
      if (item.role != "system") {
        chatexport.push({
          role: item.role,
          content: item.content,
        });
      } else {
        filename = item.content + ".csv";
      }
    });

    const csv = j2c.json2csv(chatexport, {});
    res.writeHead(200, {
      "Content-Type": "text/csv",
      "Content-Disposition":
        "attachment;filename=" +
        (filename !== ".csv" ? filename : currentid + ".csv"),
    });
    res.end(csv);
  } catch (error) {
    res.json({
      status: false,
      message: error,
    });
  }
});

module.exports = router;
