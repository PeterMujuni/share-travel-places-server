const express = require("express");
const bodyParser = require("body-parser");

const placesRoute = require("./routes/places-routes");

const app = express();

// app.use(bodyParser.urlencoded({ extended: false}))
app.use("/api/places",placesRoute);

app.listen(5000);
