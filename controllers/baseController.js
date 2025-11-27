const utilities = require("../utilities/");
const baseController = {};

baseController.buildHome = async function (req, res) {
  const nav = await utilities.getNav();

  res.render("index", { title: "Home", nav });
};

baseController.triggerError = async function (req, res, next) {
  const error = new Error("Intentional 500 error triggered");
  error.status = 500;
  next(error);
};

module.exports = baseController;
