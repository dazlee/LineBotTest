const express = require("express");
const router = express.Router();
const logger = require("./logger");
const fetch = require("isomorphic-fetch");
const sendMessage = require("./finchat").sendMessage;

const TOKEN = "this_is_my_token";
const PAGE_ACCESS_TOKEN = "EAAYwL34E0nQBANanGmZCpPRXOqlnff8rklrHQtzyZAeEgTORBdMp06U8A8QphJ8D0MZAzeKZAk1AUXx9XFwJ9r0tJNmZAowmorxrTfP2d7Iw64ecjEQs2UPOwHX3ZAarWrsDqcWs1Rgauutb4iMhiPvEA742v32kp9L2JwavVGBwZDZD";
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

router.post('/webhook', function (req, res) {
	var data = req.body;

	if (data.object === 'page') {
		data.entry.forEach(function(entry) {
			var pageID = entry.id;
			var userProfileMap = {};
			const userProfilePromises = entry.messaging.reduce((reduced, event) => {
				const userId = event.sender.id;
				if (!userProfileMap[userId]) {
					userProfileMap[userId] = reduced.length;
					const promise = fetch("https://graph.facebook.com/v2.6/" + userId + "?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=" + PAGE_ACCESS_TOKEN, {
						method: "GET"
					})
					.then(function (_res) {
						return _res.json();
					});
					reduced.push(promise);
				}
				return reduced;
			}, []);

			Promise.all(userProfilePromises)
			.then((userProfiles) => {
				const length = entry.messaging.length;
				for (let i = 0; i < length; i++) {
					entry.messaging[i].client = userProfiles[userProfileMap[entry.messaging[i].sender.id]];
				}

				entry.messaging.forEach(function(event) {
					if (event.message) {
						receivedMessage(event);
					} else {
						console.log("Webhook received unknown event: ", event);
					}
				});
			});
		});

    	res.sendStatus(200);
  	}
});

function receivedMessage(event) {
	// Putting a stub for now, we'll expand it in the following steps
	logger.info("Message data: ", event.message);

	var senderID = event.sender.id;
	var recipientID = event.recipient.id;
	var timeOfMessage = event.timestamp;
	var message = event.message;

	logger.info("Received message for user %d and page %d at %d with message:", senderID, recipientID, timeOfMessage);
	logger.info(JSON.stringify(message));

	message.userId = senderID;
	message.type = "text";
	message.content = message.text;
	sendMessage("fb", message);
}

function sendGenericMessage(recipientId, messageText) {
  // To be expanded in later sections
	logger.info("should send generic message");
}
function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}
function callSendAPI(messageData) {
	logger.info("sending message", messageData);
  fetch('https://graph.facebook.com/v2.6/me/messages?access_token=' + PAGE_ACCESS_TOKEN, {
    // qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
	headers: {
		"Content-Type": "application/json"
	},
    // json: messageData
	body: JSON.stringify(messageData)

})
.then(function (res) {
	logger.info("Success", res.status);

	// var recipientId = body.recipient_id;
	// var messageId = body.message_id;

	// logger.info("Successfully sent generic message with id %s to recipient %s",
	//   messageId, recipientId);
	// res.status(200);
 //  	res.end();
})
.catch(function (error) {
	logger.error("Unable to send message.");
	logger.error(error);
});
}

module.exports = router;
