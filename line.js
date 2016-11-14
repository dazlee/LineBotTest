var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
    res.status(200).write("test");
    res.end();
});

module.exports = router;
