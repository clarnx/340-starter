// Needed Resources
const express = require("express");
const router = new express.Router();
const registerController = require("../controllers/registerController");
const utilities = require("../utilities");


router.get("/login", utilities.handleErrors(registerController.buildLogin));

module.exports = router;