const request = require("supertest");
const app = require("./src/app");
const Restaurant = require("./models");
// const { seedRestaurant } = require("./seedData");
const syncSeed = require("./seed.js");
let numRestaurants;

beforeAll(async () => {
  await syncSeed();
  const restaurants = await Restaurant.findAll({});
  numRestaurants = restaurants.length;
});

test("should return a status code of 200 on get request", async () => {
  const response = await request(app).get("/restaurants");
  expect(response.statusCode).toEqual(200);
});

test("should return an array of restaurants", async () => {
  const response = await request(app).get("/restaurants");
  expect(Array.isArray(response.body)).toBe(true);
  expect(response.body[0]).toHaveProperty("location");
  expect(response.body[0]).toHaveProperty("cuisine");
});

test("should return the correct number of restaurants", async () => {
  const response = await request(app).get("/restaurants");
  expect(response.body.length).toEqual(numRestaurants);
});

test("should return the correct restaurant data", async () => {
  const response = await request(app).get("/restaurants");
  expect(response.body).toContainEqual(
    expect.objectContaining({
      id: 1,
      name: "AppleBees",
      location: "Texas",
      cuisine: "FastFood",
    })
  );
});

test("should return the correct restaurant data", async () => {
  const response = await request(app).get("/restaurants/1");
  expect(response.body).toEqual(
    expect.objectContaining({
      id: 1,
      name: "AppleBees",
      location: "Texas",
      cuisine: "FastFood",
    })
  );
});

test("should create a new restaurant", async () => {
  const response = await request(app).post("/restaurants").send({
    name: "Angelina's Kitchen",
    location: "New York",
    cuisine: "Italian",
  });
  expect(response.status).toBe(201);
  expect(response.body.name).toEqual("Angelina's Kitchen");
});

test("POST /restaurants returns validation errors", async () => {
  const response = await request(app).post("/restaurants").send({});
  expect(response.status).toBe(400);

  // check if array
  expect(Array.isArray(response.body.error)).toBe(true);

  const errorFields = response.body.error.map((e) => e.path);

  expect(errorFields).toEqual(
    expect.arrayContaining(["name", "location", "cuisine"])
  );

  const nameError = response.body.error.find((e) => e.path === "name");
  expect(nameError).toBeDefined();
  expect(nameError.msg).toBe("Name cannot be empty");

  const locationError = response.body.error.find((e) => e.path === "location");
  expect(locationError).toBeDefined();
  expect(locationError.msg).toBe("Location cannot be empty");

  const cuisineError = response.body.error.find((e) => e.path === "cuisine");
  expect(cuisineError).toBeDefined();
  expect(cuisineError.msg).toBe("Cuisine cannot be empty");
});

test("should update a restaurant", async () => {
  await request(app).put("/restaurants/1").send({
    name: "Cecconi's",
    location: "New York",
    cuisine: "Italian",
  });
  const restaurant = await Restaurant.findByPk(1);
  expect(restaurant.name).toEqual("Cecconi's");
});

test("should delete a restaurant", async () => {
  await request(app).delete("/restaurants/1");
  const restaurants = await Restaurant.findAll({});
  expect(restaurants.length).toEqual(numRestaurants);
  expect(restaurants[0].id).not.toEqual(1);
});
