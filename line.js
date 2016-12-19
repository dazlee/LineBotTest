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

    var message = req.body;

    var userId = message.events[0].source.userId;
    fetch("https://api.line.me/v2/bot/profile/" + userId, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + TOKEN,
        },
    })
    .then(function (_res) {
        return _res.json();
    })
    .then(function (user) {
        logger.info("user profile", user);
    })
    .catch(function (error) {
        logger.info("error", error);
    });
    console.log(message[0].source);
    console.log(message[0].message);

    fetch("http://ec2-54-238-245-232.ap-northeast-1.compute.amazonaws.com:3000/api/line/message", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
    })
    .then(function (_res) {
        logger.info("Successfully sent to finchat", _res.status);
    })
    .catch(function (error) {
        logger.info("Failed to send to finchat", error);
    });
});

router.post("/message", function (req, res) {
    var message = req.body.message;

    fetch("https://api.line.me/v2/bot/message/push", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + TOKEN,
        },
        body: JSON.stringify({
            to: "U6cb7b1eff92ce9a0805f4b8fa50af36b",
            messages: [
                {
                    type: "text",
                    text: message,
                },
            ],
        }),
    })
    .then(function (_res) {
        logger.info("Success", _res.status);
        res.status(200);
        res.end();
    })
    .catch(function (error) {
        logger.info("Error", error);
    });
});

module.exports = router;
