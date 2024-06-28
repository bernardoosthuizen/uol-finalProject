/* -------------------------------------------------------------------------- 
------------------- SOCIAL TASKER - Data Validators -------------------------
-------------------------------------------------------------------------- **/
const { body } = require("express-validator");

// Validate user data
const userValidator = [
  body("email", "Field cannot be empty.").isString().not().isEmpty(),
  body("email", "Invalid email").isString().isEmail(),
  body("name", "Field cannot be empty.").isString().not().isEmpty(),
  body("user_id", "Field cannot be empty.").isString().not().isEmpty(),
];

const idValidator = [
    body("id", "Field cannot be empty.").isString().not().isEmpty(),
];

module.exports = { userValidator, idValidator };