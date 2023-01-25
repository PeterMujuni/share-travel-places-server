const express = require("express");

const { check } = require("express-validator");

const router = express.Router();

const {
	getUsers,
	signupUser,
	loginUser,
} = require("../controllers/users-controller");
const fileUpload = require('../middleware/file-upload')

router.get("/", getUsers);
router.post(
	"/signup",
	fileUpload.single('image'),
	[
		check("name").trim().notEmpty(),
		check("email").normalizeEmail({gmail_remove_dots: false}).isEmail(),
		check("password").isLength({ min: 6 }),
	],
	signupUser
);
router.post("/login", loginUser);

module.exports = router;
