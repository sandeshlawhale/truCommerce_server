const mongoose = require("mongoose");
const logger = require('../config/logger');

const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

const password = (value, helpers) => {
  if (value.length < 8) {
    logger.error("Password must be at least 8 characters");
    return helpers.message("password must be at least 8 characters");
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    logger.error("Password must contain at least 1 letter and 1 number");
    return helpers.message(
      "password must contain at least 1 letter and 1 number"
    );
  }
  return value;
};

module.exports = {
  objectId,
  password,
};
