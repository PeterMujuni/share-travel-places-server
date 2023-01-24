const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
	let users;
	try {
		users = await User.find({}, "-password");
	} catch (error) {
		return next(new HttpError("Fetching users failed", 500));
	}
	res.json({users: users.map(user => user.toObject({getters: true}))})
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
		return next(new HttpError("Signing up failed", 500));
	}

	if (existingUser) {
		return next(
			new HttpError("User already exists, please login instead", 422)
		);
	}

	const createdUser = new User({
		name,
		email,
		image: req.file.path,
		password,
		places: []
	});

	try {
		await createdUser.save();
	} catch (error) {
		return next(new HttpError("Could not save user in database", 500));
	}

	return res
		.status(201)
		.json({ user: createdUser.toObject({ getters: true }) });
};

const loginUser = async (req, res, next) => {
	const { email, password } = req.body;

	let existingUser;
	try {
		existingUser = await User.findOne({ email });
	} catch (error) {
		return next(new HttpError("Logging in failed", 500));
	}

	if (!existingUser || existingUser.password !== password) {
		return next(new HttpError("Invalid credentials", 401));
	}

	res.json({ msg: "User is logged in", user: existingUser.toObject({getters: true}) });
};

module.exports = {
	getUsers,
	signupUser,
	loginUser,
};
