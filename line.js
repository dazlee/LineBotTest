var express = require("express");
var router = express.Router();
var logger = require("./logger");
var fetch = require("isomorphic-fetch");
var sendMessage = require("./finchat").sendMessage;

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

	sendMessage("line", message);
});

router.post("/:agentUserId", function (req, res) {
    res.status(200);
    res.end();

    var message = req.body;
	var userProfileMap = {};
	message.agentUserId = req.params.agentUserId;

	const userProfilePromises = message.events.reduce((reduced, event) => {
		const { userId } = event.source;
		if (!userProfileMap[userId]) {
			userProfileMap[userId] = reduced.length;
			const promise = fetch("https://api.line.me/v2/bot/profile/" + event.source.userId, {
				method: "GET",
				headers: {
					"Authorization": "Bearer " + TOKEN,
				},
			})
			.then(function (_res) {
				return _res.json();
			});
			reduced.push(promise);
		}
		return reduced;
	}, []);
	// const userProfilePromises = message.events.map((event) => {
	// 	return fetch("https://api.line.me/v2/bot/profile/" + event.source.userId, {
	// 		method: "GET",
	// 		headers: {
	// 			"Authorization": "Bearer " + TOKEN,
	// 		},
	// 	})
	// 	.then(function (_res) {
	// 		return _res.json();
	// 	});
	// });

	Promise.all(userProfilePromises)
	.then((userProfiles) => {
		const length = message.events.length;
		for (let i = 0; i < length; i++) {
			message.events[i].client = userProfiles[userProfileMap[message.events[i].source.userId]];
		}

		sendMessage("line", message);
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
