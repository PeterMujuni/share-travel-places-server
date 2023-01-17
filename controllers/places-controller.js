const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const getCoordsForAddress = require("../util/location");

let DUMMY_PLACES = [
	{
		id: "p1",
		title: "Empire state building",
		description: "One of the most famous buildings in the world",
		imageUrl: "https://via.placeholder.com/150",
		address: "20 W 34th St., New York, NY 10001, United States",
		location: {
			lat: 40.7484405,
			lng: -73.9878531,
		},
		creator: "u1",
	},
	{
		id: "p2",
		title: "Rundetårn",
		description: "One of the most famous buildings in the world",
		imageUrl: "https://via.placeholder.com/150",
		address: "1150 Copenhagen Municipality",
		location: {
			lat: "55.6813355",
			lng: "12.5735265",
		},
		creator: "u2",
	},
	{
		id: "p1",
		title: "Empire state building",
		description: "One of the most famous buildings in the world",
		imageUrl: "https://via.placeholder.com/150",
		address: "20 W 34th St., New York, NY 10001, United States",
		location: {
			lat: 40.7484405,
			lng: -73.9878531,
		},
		creator: "u1",
	},
];

const getPlaceById = (req, res, next) => {
	const placeId = req.params.pid;
	const place = DUMMY_PLACES.find((p) => {
		return p.id === placeId;
	});
	if (!place) {
		throw new HttpError("Cold not find a place for the provided id.", 404);
	}
	res.json({ place });
};

const getPlacesByUserId = (req, res, next) => {
	const userId = req.params.uid;
	const places = DUMMY_PLACES.filter((p) => {
		return p.creator === userId;
	});
	if (!places || places.length === 0) {
		return next(
			new HttpError(
				"Could not find a places for the provided user id.",
				404
			)
		);
	}
	res.json({ places });
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

	const createdPlace = {
		id: uuidv4(),
		title,
		description,
		location: coordinates,
		address,
		creator,
	};

	DUMMY_PLACES.unshift(createdPlace);

	res.status(201).json({ place: createdPlace });
};

const updatePlace = (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		console.log(errors);
		throw new HttpError("Invalid inputs passed", 422);
	}

	const placeId = req.params.pid;
	const { title, description } = req.body;

	const updatePlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
	const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
	updatePlace.title = title;
	updatePlace.description = description;

	DUMMY_PLACES[placeIndex] = updatePlace;

	res.status(200).json({ place: updatePlace });
};

const deletePlace = (req, res, next) => {
	const placeId = req.params.pid;
	if (!DUMMY_PLACES.find((p) => p.id === placeId)) {
		throw new HttpError("Could not find a place for that ID", 404);
	}

	DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);
	res.status(200).json({ message: "Deleted place." });
};

module.exports = {
	getPlaceById,
	getPlacesByUserId,
	createPlace,
	updatePlace,
	deletePlace,
};
