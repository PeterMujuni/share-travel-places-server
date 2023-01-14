const HttpError = require("../models/http-error");
const { v4: uuidv4} = require('uuid')

const DUMMY_PLACES = [
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
];

const getPlaceById = (req, res, next) => {
	const placeId = req.params.pid;
	const place = DUMMY_PLACES.find((p) => {
		return p.id === placeId;
	});
	if (!place) {
		throw new HttpError("Cold not find a place for the provided id.", 404);
	}
	res.json(place);
};

const getPlaceByUserId = (req, res, next) => {
	const userId = req.params.uid;
	const place = DUMMY_PLACES.find((p) => {
		return p.creator === userId;
	});
	if (!place) {
		return next(
			new HttpError(
				"Could not find a place for the provided user id.",
				404
			)
		);
	}
	res.json(place);
};

const createPlace = (req, res, next) => {
	const { title, description, coordinates, address, creator } = req.body;

    const createdPlace = {
        id: uuidv4(),
        title,
        description,
        location: coordinates,
        address,
        creator
    }

    DUMMY_PLACES.unshift(createdPlace)

    res.status(201).json({place: createdPlace})
};

module.exports = {
	getPlaceById,
	getPlaceByUserId,
	createPlace,
};
