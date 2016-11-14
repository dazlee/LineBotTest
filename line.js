var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
    res.status(200).write("test");
    res.end();
});

// webhooks
router.post("/", function (req, res) {
    console.log(req.headers);
    console.log(req.body);
    res.status(200);
    res.end();
});

module.exports = router;
