/* -------------------------------------------------------------------------- 
------------------- SOCIAL TASKER - Data Validators -------------------------
-------------------------------------------------------------------------- **/
const { body } = require("express-validator");
require("dotenv").config();

// Validate user data
const userValidator = [
    body("email", "Field cannot be empty.").not().isEmpty(),
    body("email", "Invalid email").isString().isEmail(),
    body("name", "Field cannot be empty.").not().isEmpty(),
    body("name", "Invalid name").isString(),
    body("user_id", "Field cannot be empty.").not().isEmpty(),
    body("user_id", "Invalid ID").isString(),
];

const idValidator = [
  body("userId", "Field cannot be empty.").not().isEmpty(),
  body("userId", "Invalid ID").isString(),
];

const taskValidator = [
    body("title", "Field cannot be empty.").isString().not().isEmpty(),
    body("description", "Field cannot be empty.").isString(),
    body("details", "Field cannot be empty.").isString(),
    body("status", "Field cannot be empty.").isString().not().isEmpty(),
    body("due_date", "Field cannot be empty.").not().isEmpty(),
    // body("due_date", "Invalid date").isString().isDate(),
    body("priority", "Field cannot be empty.")
        .isString()
        .isIn(["low", "medium", "high"]),
    body("user_id", "Field cannot be empty.").not().isEmpty(),
    body("user_id", "Invalid ID").isString(),
];

// API Key Middleware
const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.get('X-API-Key'); // Get API key from the request header
  if (!apiKey) {
    return res.status(401).send({ error: 'API key is required' });
  }

  // Check if API key is valid
  if (apiKey !== process.env.CREATE_API_KEY) {
    return res.status(403).send({ error: "Invalid API key" });
  }

  next(); // Proceed to the next middleware or route handler
};

module.exports = { userValidator, idValidator, taskValidator, apiKeyMiddleware };