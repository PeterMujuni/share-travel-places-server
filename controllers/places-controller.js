const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");
const User = require("../models/user");
const { mongoose } = require("mongoose");

const getPlaceById = async (req, res, next) => {
	const placeId = req.params.pid;
	let place;

	try {
		place = await Place.findById(placeId);
	} catch (error) {
		const err = new HttpError(
			"Something went wrong, could not find a place",
			500
		);
		return next(err);
	}

	if (!place) {
		const error = new HttpError(
			"Cold not find a place for the provided id.",
			404
		);
		return next(error);
	}

	res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
	const userId = req.params.uid;
	let places;
	try {
		places = await Place.find({ creator: userId });
	} catch (error) {
		const err = new HttpError("Could not find places for that user", 500);
		return next(err);
	}

	if (!places || places.length === 0) {
		return next(
			new HttpError(
				"Could not find a places for the provided user id.",
				404
			)
		);
	}
	res.json({
		places: places.map((place) => place.toObject({ getters: true })),
	});
};

const createPlace = async (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		console.log(errors);
		return next(new HttpError("Invalid inputs passed", 422));
	}

	const { title, description, address, creator } = req.body;

	let coordinates;
	try {
		coordinates = await getCoordsForAddress(address);
	} catch (error) {
		return next(error);
	}

	const createdPlace = new Place({
		title,
		description,
		address,
		location: coordinates,
		image: "https://via.placeholder.com/150",
		creator,
	});

	let user;

	try {
		user = await User.findById(creator)
	} catch (error) {
		return next(new HttpError("Creating place failed", 500))
	}

	if (!user) {
		return next(new HttpError("Could not find user", 404))
	}

	console.log(user)

	try {
		const sess = await mongoose
	} catch (error) {
		const err = new HttpError(
			"Could not create place, please try again!",
			500
		);
		return next(err);
	}

	res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		console.log(errors);
		return next(new HttpError("Invalid inputs passed", 422));
	}

	const placeId = req.params.pid;
	const { title, description } = req.body;

	let place;
	try {
		place = await Place.findById(placeId);
	} catch (error) {
		return next(new HttpError("Could not find place with that ID", 500));
	}

	place.title = title;
	place.description = description;

	try {
		await place.save();
	} catch (error) {
		return next(new HttpError("Could not update place", 500));
	}

	res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
	const placeId = req.params.pid;
	let place;
	try {
		place = await Place.findById(placeId);
	} catch (error) {
		return next(new HttpError("Could not find place in database", 500))
	}

	try {
		await place.remove();
	} catch (error) {
		return next(new HttpError("Could not delete place in database", 500));
	}
	
	res.status(200).json({ message: "Deleted place." });
};

module.exports = {
	getPlaceById,
	getPlacesByUserId,
	createPlace,
	updatePlace,
	deletePlace,
};
