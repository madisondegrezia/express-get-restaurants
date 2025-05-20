const express = require("express");
const app = express();

const { restaurantRouter } = require("../routes/restaurants.js");

app.use("/restaurants", restaurantRouter);

module.exports = app;
