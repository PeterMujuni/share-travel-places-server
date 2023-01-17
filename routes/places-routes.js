const express = require("express");
const { check } = require("express-validator");

const {
	getPlaceById,
	getPlacesByUserId,
	createPlace,
	updatePlace,
	deletePlace,
} = require("../controllers/places-controller");

const router = express.Router();

router.get("/:pid", getPlaceById);

router.get("/user/:uid", getPlacesByUserId);

router.post(
	"/",
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
