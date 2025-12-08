const { body, validationResult } = require("express-validator");
const validate = {};

/* ***************************
 *  Favorite Data Validation Rules
 * ************************** */
validate.favoriteRules = () => {
  return [
    // inv_id is required and must be a positive integer
    body("inv_id")
      .trim()
      .notEmpty()
      .withMessage("Vehicle ID is required.")
      .isInt({ min: 1 })
      .withMessage("Invalid vehicle ID."),
  ];
};

/* ***************************
 *  Check data and return errors or continue
 * ************************** */
validate.checkFavoriteData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("notice", errors.array()[0].msg);
    return res.redirect("back");
  }
  next();
};

module.exports = validate;

