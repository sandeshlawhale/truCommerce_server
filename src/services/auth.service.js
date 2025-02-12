const httpStatus = require('http-status');
const userService = require('./user.service');
const ApiError = require('../utils/ApiError');
const Token = require('../models/token.model');
const logger = require('../config/logger');
const tokenService = require('../services/token.service')
const { tokenTypes } = require('../config/tokens');

// email and password provide karo and this function will give you the 
// user if the user exist and if not then error fek dega
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    logger.error('Incorrect email or password');
    throw new ApiError(httpStatus.status.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

// logout agar krna h to refreshToken provide karo and then refreshToken ud jaega
// database me se
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    logger.error('Refresh token not found');
    throw new ApiError(httpStatus.status.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.deleteOne();
};

// accessToken abhi refresh karna h to uske liye refreshToken bhej ke acess token
// refresh ho jaega
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      logger.error("User is not authenticated");
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.status.UNAUTHORIZED, 'Please authenticate');
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth
};
