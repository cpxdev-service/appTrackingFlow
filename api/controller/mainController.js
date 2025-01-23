const express = require("express")
const router =  express.Router()

router.post("/", (req, res) => {
    res.json({
        status: true
    });
});

module.exports = router;