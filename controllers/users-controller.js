require("dotenv").config();
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getUsers = async (req, res, next) => {
	let users;
	try {
		users = await User.find({}, "-password");
	} catch (error) {
		return next(new HttpError("Fetching users failed", 500));
	}
	res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signupUser = async (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return next(new HttpError("Invalid inputs passed", 422));
	}
	const { name, email, password } = req.body;

	let existingUser;
	try {
		existingUser = await User.findOne({ email });
	} catch (error) {
		console.log(error);
		return next(new HttpError("Signing up failed", 500));
	}

	if (existingUser) {
		return next(
			new HttpError("User already exists, please login instead", 422)
		);
	}

	let hashedPassword;
	try {
		hashedPassword = await bcrypt.hash(password, 12);
	} catch (error) {
		console.log(error);
		return next(
			new HttpError("Could not create user, please try again", 500)
		);
	}

	const createdUser = new User({
		name,
		email,
		image: req.file.path,
		password: hashedPassword,
		places: [],
	});

	try {
		await createdUser.save();
	} catch (error) {
		console.log(error);
		return next(new HttpError("Could not save user in database", 500));
	}

	let token;
	try {
		token = jwt.sign(
			{ userId: createdUser.id, email: createdUser.email },
			process.env.SECRET_TOKEN_KEY,
			{ expiresIn: "1h" }
		);
	} catch (error) {
		console.log(error);
		return next(new HttpError("Signing up failed", 500));
	}

	return res
		.status(201)
		.json({ userId: createdUser.id, email: createdUser.email, token });
};

const loginUser = async (req, res, next) => {
	const { email, password } = req.body;

	let existingUser;
	try {
		existingUser = await User.findOne({ email });
	} catch (error) {
		console.log(error);
		return next(new HttpError("Logging in failed", 500));
	}

	if (!existingUser) {
		return next(new HttpError("Invalid credentials", 403));
	}

	let isValidPassword = false;
	try {
		isValidPassword = await bcrypt.compare(password, existingUser.password);
	} catch (error) {
		console.log(error);
		return next(
			new HttpError(
				"Could not log you in, please check your credentials and try again",
				500
			)
		);
	}

	if (!isValidPassword) {
		return next(new HttpError("Invalid credentials", 403));
	}

	let token;
	try {
		token = jwt.sign(
			{ userId: existingUser.id, email: existingUser.email },
			process.env.SECRET_TOKEN_KEY,
			{ expiresIn: "1h" }
		);
	} catch (error) {
		console.log(error);
		return next(new HttpError("Logging in failed", 500));
	}

	res.json({
		userId: existingUser.id,
		email: existingUser.email,
		token,
	});
};

module.exports = {
	getUsers,
	signupUser,
	loginUser,
};
