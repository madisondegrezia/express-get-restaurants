const express = require("express");
const restaurantRouter = express.Router();
const Restaurant = require("../models/index");
const db = require("../db/connection");
const { check, validationResult } = require("express-validator");

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
  if (restaurant) {
    res.json(restaurant);
  } else {
    res.status(404).json({ error: "Restaurant not found" });
  }
});

restaurantRouter.post(
  "/",
  [
    check("name").not().isEmpty().trim().withMessage("Name cannot be empty"),
    check("location")
      .not()
      .isEmpty()
      .trim()
      .withMessage("Location cannot be empty"),
    check("cuisine")
      .not()
      .isEmpty()
      .trim()
      .withMessage("Cuisine cannot be empty"),
  ],
  async (req, res, next) => {
    try {
      // Extracts errors from check()
      const errors = validationResult(req);
      // If there are any errors, return the errors in the response
      if (!errors.isEmpty()) {
        res.status(400).json({ error: errors.array() });
      } else {
        // No error? Run the POST request
        const newRestaurant = await Restaurant.create(req.body);
        res.status(201).json(newRestaurant);
      }
    } catch (error) {
      next(error);
    }
  }
);

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
