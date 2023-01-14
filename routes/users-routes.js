const express = require("express");

const router = express.Router();

const DUMMY_USERS = [
	{
		id: "u1",
		name: "Mark Shults",
		image: "https://i.pravatar.cc/300",
		places: 2,
	},
	{
		id: "u2",
		name: "Mark Sharts",
		image: "https://i.pravatar.cc/300",
		places: 3,
	},
];

router.get("/:uid", (req, res, next) => {
    const userId = req.params.uid
	const user = DUMMY_USERS.find(u => {
        return u.id === userId
    })
    res.json(user)
});

module.exports = router
