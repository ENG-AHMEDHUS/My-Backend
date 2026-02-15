const { body } = require("express-validator");
// also there are other like joi, zod

const validationScheme = () => {
  return [
    body("title")
      .notEmpty()
      .withMessage("title is required")
      .isLength({ min: 2 })
      .withMessage("title at least two chars"),
    body("price")
      .notEmpty()
      .withMessage("price is required")
      .isLength({ min: 3 })
      .withMessage("price at least three digits"),
  ];
};

module.exports = validationScheme;