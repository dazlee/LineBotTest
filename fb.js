const express = require("express");
const router = express.Router();
const logger = require("./logger");
const fetch = require("isomorphic-fetch");

const TOKEN = "this_is_my_token";
const PAGE_TOKEN = "EAAYwL34E0nQBANanGmZCpPRXOqlnff8rklrHQtzyZAeEgTORBdMp06U8A8QphJ8D0MZAzeKZAk1AUXx9XFwJ9r0tJNmZAowmorxrTfP2d7Iw64ecjEQs2UPOwHX3ZAarWrsDqcWs1Rgauutb4iMhiPvEA742v32kp9L2JwavVGBwZDZD";
router.get("/webhook", (req, res) => {
	if (req.query['hub.mode'] === 'subscribe' &&
		req.query['hub.verify_token'] === PAGE_TOKEN) {
		logger.info("Validating webhook");
		res.status(200).send(req.query['hub.challenge']);
	} else {
		logger.error("Failed validation. Make sure the validation tokens match.");
		res.sendStatus(403);
	}
});

router.post('/webhook', function (req, res) {
  var data = req.body;

  // Make sure this is a page subscription
  if (data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
        } else {
          console.log("Webhook received unknown event: ", event);
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.
    res.sendStatus(200);
  }
});

function receivedMessage(event) {
  // Putting a stub for now, we'll expand it in the following steps
  logger.info("Message data: ", event.message);
}

module.exports = router;
