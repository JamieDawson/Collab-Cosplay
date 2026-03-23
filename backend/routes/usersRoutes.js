// routes/usersRoutes.js
const express = require("express");
const router = express.Router();
const {
  completeProfile,
  getUserByAuth0Id,
  getUserByUsername,
  updateAboutMe,
  deleteUser,
} = require("../controllers/usersController");

// PATCH - update about me (body: auth0_id, about_me) — must be own profile in practice
router.patch("/api/users/about-me", updateAboutMe);

// POST - complete or update a user's profile
router.post("/api/users/complete-profile", completeProfile);

// GET - Retrieve a user's data by username (before :auth0_id)
router.get("/api/users/username/:username", getUserByUsername);

// GET - retrieve a user's data by Auth0 ID (from req.params)
router.get("/api/users/:auth0_id", getUserByAuth0Id);

//DELETE a user out of Auth0 and Postgres
router.delete("/api/users/delete-account/:id", deleteUser);

module.exports = router;
