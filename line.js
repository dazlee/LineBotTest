var express = require("express");
var router = express.Router();
var logger = require("./logger");

router.get("/", function (req, res) {
    res.status(200).write("test");
    res.end();
});

// webhooks
router.post("/", function (req, res) {
    logger.info(req.headers);
    logger.info(req.body);
    res.status(200);
    res.end();
});

module.exports = router;
