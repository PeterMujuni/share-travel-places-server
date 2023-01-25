const express = require("express");
const { check } = require("express-validator");
const {
	getPlaceById,
	getPlacesByUserId,
	createPlace,
	updatePlace,
	deletePlace,
} = require("../controllers/places-controller");
const checkAuth = require("../middleware/check-auth");
const fileUpload = require('../middleware/file-upload')

const router = express.Router();

router.get("/:pid", getPlaceById);

router.get("/user/:uid", getPlacesByUserId);

router.use(checkAuth)

router.post(
	"/",
	fileUpload.single('image'),
	[
		check("title").trim().notEmpty(),
		check("description").isLength({ min: 6 }),
		check("address").trim().notEmpty(),
	],
	createPlace
);

router.patch(
	"/:pid",
	[
		check("title").trim().notEmpty(),
		check("description").isLength({ min: 6 }),
	],
	updatePlace
);

router.delete("/:pid", deletePlace);

module.exports = router;
