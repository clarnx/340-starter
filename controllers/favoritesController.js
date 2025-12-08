const favoritesModel = require("../models/favorites-model");
const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const favCont = {};

/* ***************************
 *  Build favorites list view
 * ************************** */
favCont.buildFavoritesList = async function (req, res, next) {
  let nav = await utilities.getNav();
  const account_id = res.locals.accountData.account_id;
  const favorites = await favoritesModel.getFavoritesByAccountId(account_id);
  const favoritesGrid = await utilities.buildFavoritesGrid(favorites);

  res.render("./favorites/list", {
    title: "My Favorites",
    nav,
    favoritesGrid,
    errors: null,
  });
};

/* ***************************
 *  Add vehicle to favorites
 * ************************** */
favCont.addFavorite = async function (req, res, next) {
  const { inv_id } = req.body;
  const account_id = res.locals.accountData.account_id;

  // Validate inv_id
  const parsedInvId = parseInt(inv_id);
  if (isNaN(parsedInvId)) {
    req.flash("notice", "Invalid vehicle ID.");
    return res.redirect("back");
  }

  // Verify vehicle exists
  const vehicle = await invModel.getVehicleByInventoryId(parsedInvId);
  if (!vehicle) {
    req.flash("notice", "Vehicle not found.");
    return res.redirect("back");
  }

  const result = await favoritesModel.addFavorite(account_id, parsedInvId);

  if (result && result.error) {
    req.flash("notice", result.error);
  } else if (result) {
    req.flash(
      "notice",
      `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model} added to your favorites!`
    );
  } else {
    req.flash("notice", "Sorry, there was an error adding to favorites.");
  }

  res.redirect(`/inv/detail/${parsedInvId}`);
};

/* ***************************
 *  Remove vehicle from favorites
 * ************************** */
favCont.removeFavorite = async function (req, res, next) {
  const { inv_id } = req.body;
  const account_id = res.locals.accountData.account_id;
  const returnTo = req.body.returnTo || "list"; // Where to redirect after removal

  // Validate inv_id
  const parsedInvId = parseInt(inv_id);
  if (isNaN(parsedInvId)) {
    req.flash("notice", "Invalid vehicle ID.");
    return res.redirect("/favorites/");
  }

  const result = await favoritesModel.removeFavorite(account_id, parsedInvId);

  if (result && result.rowCount === 1) {
    req.flash("notice", "Vehicle removed from your favorites.");
  } else {
    req.flash("notice", "Sorry, there was an error removing from favorites.");
  }

  // Redirect based on where the request came from
  if (returnTo === "detail") {
    res.redirect(`/inv/detail/${parsedInvId}`);
  } else {
    res.redirect("/favorites/");
  }
};

/* ***************************
 *  Check if vehicle is favorited (JSON response for AJAX)
 * ************************** */
favCont.checkFavoriteStatus = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  const account_id = res.locals.accountData?.account_id;

  if (!account_id) {
    return res.json({ isFavorite: false, loggedIn: false });
  }

  const isFavorite = await favoritesModel.checkFavorite(account_id, inv_id);
  return res.json({ isFavorite, loggedIn: true });
};

module.exports = favCont;

