const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');
const config = require('../config/config');
const catchAsync = require("../utils/catchAsync");
const Token = require('../models/token.model');
const allRoles = require('../config/roles');

const authorizeJwt = () => catchAsync(async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if(!authHeader || !authHeader.startsWith("Bearer")) {
      throw new ApiError(httpStatus.status.BAD_REQUEST, "Authorization header with jwt missing");
    }
    const token = authHeader.split(" ")[1]; // bearer token
    logger.info(token);
    const payload = await jwt.verify(token, config.jwt.secret);
    req.user = payload;
    logger.info(typeof(req.user.sub));
    next();
});

const authorizeRoles = (requiredPermissions) => {
  return catchAsync(async (req, res, next) => {
    if (!req.user || !req.user.role) {
      throw new ApiError(httpStatus.status.FORBIDDEN, "Access Denied. No role found");
    }

    const userRole = req.user.role;
    const userPermissions = allRoles[userRole] || [];
    const hasPermission = requiredPermissions.some(permission => userPermissions.includes(permission));

    if (!hasPermission) {
      throw new ApiError(httpStatus.status.UNAUTHORIZED, "Unauthorized to access the resource");
    }

    next();
  });
};

module.exports = { authorizeJwt, authorizeRoles };
