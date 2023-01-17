const express = require("express");

const { check } = require("express-validator");

const router = express.Router();

const {
	getUsers,
	signupUser,
	loginUser,
} = require("../controllers/users-controller");

router.get("/", getUsers);
router.post(
	"/signup",
	[
		check("name").trim().notEmpty(),
		check("email").normalizeEmail().isEmail(),
		check("password").isLength({ min: 6 }),
	],
	signupUser
);
router.post("/login", loginUser);

module.exports = router;
