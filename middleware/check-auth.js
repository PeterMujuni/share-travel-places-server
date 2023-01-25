require("dotenv").config();
const HttpError = require("../models/http-error");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
	if (req.method === "OPTIONS") {
		return next();
	}

	try {
		const token = req.headers.authorization.split(" ")[1];
		if (!token) {
			throw new Error("Authentication failed!");
		}
		const decodedTOken = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
		req.userData = { userId: decodedTOken.userId };
		next();
	} catch (error) {
		console.log(error);
		return next(new HttpError("Authentication failed", 401));
	}
};
