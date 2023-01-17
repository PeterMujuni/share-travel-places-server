const HttpError = require("../models/http-error");
const { validationResult} = require("express-validator")

let DUMMY_USERS = [
	{
		id: "u1",
		name: "Mark Shults",
		email: "test@test.com",
		password: "testers",
	},
	{
		id: "u2",
		name: "Mark Sharts",
		email: "test@test.com",
		password: "testers",
	},
	{
		id: "u3",
		name: "Peter Sharts",
		email: "test@test.com",
		password: "testers",
	},
];

const getUsers = (req, res, next) => {
	res.status(200).json({ users: DUMMY_USERS });
};

const signupUser = (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		console.log(errors);
		throw new HttpError("Invalid inputs passed", 422);
	}

	const { name, email, password } = req.body;

	const userExist = DUMMY_USERS.find((p) => p.email === email);

	if (userExist) {
		throw new HttpError("User already exist", 401);
	}

	const createdUser = {
		id: "u" + (DUMMY_USERS.length + 1),
		name,
		email,
		password,
	};

	DUMMY_USERS.push(createdUser);

	return res.status(201).json({ user: createdUser });
};

const loginUser = (req, res, next) => {
	const { email, password } = req.body;

	const userExist = DUMMY_USERS.find((u) => u.email === email);

	if (!userExist || userExist.password !== password) {
		throw new HttpError("Could not authenticate user", 401);
	}

	res.json({ msg: "User is logged in" });
};

module.exports = {
	getUsers,
	signupUser,
	loginUser,
};
