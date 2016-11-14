var express = require("express");
var router = express.Router();
var logger = require("./logger");
var fetch = require("isomorphic-fetch");

var TOKEN = "Yn+/ek5d90+zpiEybkmnS7Q1smWwDbySR0utAIAlDqeEo/ZFM/1453idLSaRGfYZTqG4Rva0zjZn9wQLcEPUgzo3eu2iuzJzbeP4kgzKYnadcGi/wA0FVC47s4GykoMoTngORAjX/Ou2/Gc/no9YGQdB04t89/1O/w1cDnyilFU=";

router.get("/", function (req, res) {
    res.status(200).write("test");
    res.end();
});

// webhooks
router.post("/", function (req, res) {
    logger.info("Body", req.body);
    res.status(200);
    res.end();

    fetch("https://api.line.me/v2/bot/message/push", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": TOKEN,
        },
        body: JSON.stringify({
            to: "U6cb7b1eff92ce9a0805f4b8fa50af36b",
            messages: [
                {
                    type: "text",
                    text: "song lala",
                },
                {
                    type: "text",
                    text: "and you?",
                },
            ],
        }),
    })
    .then(function (res) {
        logger.info("Success");
    })
    .then(function (error) {
        logger.info("Error", error);
    });
});

module.exports = router;
