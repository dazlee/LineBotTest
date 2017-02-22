const logger = require("./logger");

function sendMessage(channel, message) {
	logger.info("to ", channel);
	logger.info("message ", message);
	switch (channel) {
		case "line":
			sendMessageToLine(message);
			break;
		case "fb":
			sendMessageToFB(message);
			break;
		default:
			logger.info("send to no where", message, channel);
	}
}

function sendMessageToLine(message) {
	fetch("http://ec2-13-113-75-73.ap-northeast-1.compute.amazonaws.com:3000/api/social/line/message", {
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
}
function sendMessageToFB(message) {
	fetch("http://ec2-13-113-75-73.ap-northeast-1.compute.amazonaws.com:3000/api/social/fb/message", {
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
}

module.exports = {
	sendMessage
};
