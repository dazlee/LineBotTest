const express = require("express");
const router = express.Router();

const fs = require("fs");
const uuidV4 = require("uuid/v4");

router.put("/",  (req, res) => {
	let data = Buffer.from([]);
	req.on("data", function (chunk) {
		let totalLength = data.length + chunk.length;
		data = Buffer.concat([data, chunk], totalLength);
	});
	req.on("end", function () {
		const filename = uuidV4();
		fs.writeFile(`./public/tmp/charts/${filename}.jpeg`, data, "base64", function (error) {
			const url = `https://startertech-line-integration.herokuapp.com/tmp/charts/${filename}.jpeg`;
			res.status(200).send(url);
			res.end(url);
		});
	});
});

module.exports = router;
