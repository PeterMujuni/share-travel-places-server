require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const placesRoute = require("./routes/places-routes");
const usersRoute = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

mongoose.set("strictQuery", false);

app.use(bodyParser.json());

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
	next();
});

app.use("/api/places", placesRoute);
app.use("/api/users", usersRoute);

//error handling for nonexisting routes
app.use((req, res, next) => {
	const error = new HttpError("Could not find this route.", 404);
	throw error;
});

//default error handling
app.use((error, req, res, next) => {
	if (res.headerSent) {
		return next(error);
	}

	res.status(error.code || 500);
	res.json({ message: error.message || "An unknown error accurred!" });
});

mongoose
	.connect(process.env.MONGO_DB)
	.then(() => {
		app.listen(process.env.PORT);
		console.log(
			"**Connected to DB** & Server listening on port " +
				process.env.PORT
		);
	})
	.catch((err) => {
		console.log(err);
	});
