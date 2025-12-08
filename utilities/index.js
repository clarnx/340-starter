const jwt = require("jsonwebtoken");
const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* ************************
 * Build vehicle detail HTML
 ************************** */
Util.buildVehicleDetail = function (vehicle) {
  if (!vehicle) {
    return '<p class="notice">Sorry, vehicle not found.</p>';
  }

  let detail = '<div class="vehicle-detail">';
  detail += '<div class="vehicle-image">';
  detail += `<img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}">`;
  detail += "</div>";
  detail += '<div class="vehicle-info">';
  detail += `<h2>${vehicle.inv_make} ${vehicle.inv_model} Details</h2>`;
  detail += `<p class="vehicle-price"><strong>Price: $${new Intl.NumberFormat(
    "en-US"
  ).format(vehicle.inv_price)}</strong></p>`;
  detail += `<p class="vehicle-description"><strong>Description:</strong> ${vehicle.inv_description}</p>`;
  detail += `<p class="vehicle-color"><strong>Color:</strong> ${vehicle.inv_color}</p>`;
  detail += `<p class="vehicle-miles"><strong>Miles:</strong> ${new Intl.NumberFormat(
    "en-US"
  ).format(vehicle.inv_miles)}</p>`;
  detail += "</div>";
  detail += "</div>";

  return detail;
};

/* ************************
 * Build classification select list
 ************************** */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected ";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });
  classificationList += "</select>";
  return classificationList;
};

/* ************************
 * Build favorites grid HTML
 ************************** */
Util.buildFavoritesGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="favorites-display">';
    data.forEach((vehicle) => {
      grid += '<li class="favorite-item">';
      grid +=
        '<a href="/inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        '" /></a>';
      grid += '<div class="favorite-info">';
      grid += "<h2>";
      grid +=
        '<a href="/inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_year +
        " " +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        '<p class="favorite-price">$' +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</p>";
      grid +=
        '<p class="favorite-date">Added: ' +
        new Date(vehicle.date_added).toLocaleDateString() +
        "</p>";
      grid +=
        '<form action="/favorites/remove" method="post" class="remove-favorite-form">';
      grid +=
        '<input type="hidden" name="inv_id" value="' + vehicle.inv_id + '">';
      grid += '<input type="hidden" name="returnTo" value="list">';
      grid +=
        '<button type="submit" class="btn-remove-favorite" title="Remove from favorites">';
      grid += '<span class="heart-icon filled">&hearts;</span> Remove';
      grid += "</button>";
      grid += "</form>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid =
      '<div class="no-favorites">' +
      "<p>You haven't added any vehicles to your favorites yet.</p>" +
      '<p><a href="/">Browse our inventory</a> and click the heart icon to save vehicles you like!</p>' +
      "</div>";
  }
  return grid;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

/* ****************************************
 *  Check Account Type (Employee or Admin)
 * ************************************ */
Util.checkAccountType = (req, res, next) => {
  if (res.locals.loggedin) {
    const accountType = res.locals.accountData.account_type;
    if (accountType === "Employee" || accountType === "Admin") {
      next();
    } else {
      req.flash(
        "notice",
        "You do not have permission to access this resource."
      );
      return res.redirect("/account/login");
    }
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

module.exports = Util;
