const httpStatus = require("http-status");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const ifUserDontExists = require("../utils/userUtil");
const logger = require("../config/logger");

const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    logger.error("Email already taken, user.service");
    throw new ApiError(httpStatus.status.BAD_REQUEST, "Email already taken");
  }
  logger.info("User created, user.service");
  const user = await User.create(userBody);
  return user;
};

const getUsers = async () => {
  return await User.find();
};

const getUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const getUserById = async (id) => {
  return await User.findById(id);
};

const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  ifUserDontExists(user);
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    logger.error("Email already taken, user.service");
    throw new ApiError(httpStatus.status.BAD_REQUEST, "Email already taken");
  }
  Object.assign(user, updateBody);
  await user.save();
  logger.info("User updated, user.service");
  return user;
};

const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  ifUserDontExists(user);
  logger.info("User deleted, user.service");
  await user.deleteOne();
  return user;
};

module.exports = {
  getUsers,
  createUser,
  getUserByEmail,
  getUserById,
  updateUserById,
  deleteUserById,
};
