const express = require("express");
const { Router } = require("express");
const restaurantRouter = Router();
const Restaurant = require("../models/index");
const db = require("../db/connection");

restaurantRouter.use(express.json());
restaurantRouter.use(express.urlencoded({ extended: true }));

// get all restaurants
restaurantRouter.get("/", async (req, res) => {
  const restaurants = await Restaurant.findAll({});
  res.json(restaurants);
});

// get restaurant by specific id
restaurantRouter.get("/:id", async (req, res) => {
  const restaurant = await Restaurant.findByPk(req.params.id);
  res.json(restaurant);
});

restaurantRouter.post("/", async (req, res) => {
  const newRestaurant = await Restaurant.create(req.body);
  res.status(201).json(newRestaurant);
});

restaurantRouter.put("/:id", async (req, res) => {
  const updatedRestaurant = await Restaurant.update(req.body, {
    where: { id: req.params.id },
  });
  res.json(updatedRestaurant);
});

restaurantRouter.delete("/:id", async (req, res) => {
  const deletedRestaurant = await Restaurant.destroy({
    where: { id: req.params.id },
  });
  res.json(deletedRestaurant);
});

module.exports = { restaurantRouter };
