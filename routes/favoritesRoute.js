// Needed Resources
const express = require("express");
const router = new express.Router();
const favoritesController = require("../controllers/favoritesController");
const utilities = require("../utilities");
const favValidate = require("../utilities/favorites-validation");

// Route to display favorites list (requires login)
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(favoritesController.buildFavoritesList)
);

// Route to add a vehicle to favorites (requires login)
router.post(
  "/add",
  utilities.checkLogin,
  favValidate.favoriteRules(),
  favValidate.checkFavoriteData,
  utilities.handleErrors(favoritesController.addFavorite)
);

// Route to remove a vehicle from favorites (requires login)
router.post(
  "/remove",
  utilities.checkLogin,
  favValidate.favoriteRules(),
  favValidate.checkFavoriteData,
  utilities.handleErrors(favoritesController.removeFavorite)
);

// Route to check favorite status (JSON response for AJAX)
router.get(
  "/check/:inv_id",
  utilities.handleErrors(favoritesController.checkFavoriteStatus)
);

module.exports = router;

