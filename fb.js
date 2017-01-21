const express = require("express");
const router = express.Router();
const logger = require("./logger");
const fetch = require("isomorphic-fetch");

const TOKEN = "this_is_my_token";

router.get("/webhook", (req, res) => {
	if (req.query['hub.mode'] === 'subscribe' &&
		req.query['hub.verify_token'] === TOKEN) {
		logger.info("Validating webhook");
		res.status(200).send(req.query['hub.challenge']);
	} else {
		logger.error("Failed validation. Make sure the validation tokens match.");
		res.sendStatus(403);
	}
});

module.exports = router;
