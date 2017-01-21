const express = require("express");
const router = express.Router();
const logger = require("./logger");
const fetch = require("isomorphic-fetch");

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

  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  logger.info("Received message for user %d and page %d at %d with message:",
    senderID, recipientID, timeOfMessage);
  logger.info(JSON.stringify(message));

  var messageId = message.mid;

  var messageText = message.text;
  var messageAttachments = message.attachments;

  if (messageText) {

    // If we receive a text message, check to see if it matches a keyword
    // and send back the example. Otherwise, just echo the text we received.
    switch (messageText) {
      case 'generic':
        sendGenericMessage(senderID);
        break;

      default:
        sendTextMessage(senderID, messageText);
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
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
  fetch({
    uri: 'https://graph.facebook.com/v2.6/me/messages?access_token=' + PAGE_ACCESS_TOKEN,
    // qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
	headers: {
		"Content-Type": "application/json"
	},
    // json: messageData
	body: JSON.stringify(messageData)

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      logger.info("Successfully sent generic message with id %s to recipient %s",
        messageId, recipientId);
    } else {
      logger.error("Unable to send message.");
      logger.error(response);
      logger.error(error);
    }
  });
}

module.exports = router;
