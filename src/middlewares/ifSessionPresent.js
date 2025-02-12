const Token = require('../models/token.model');
const catchAsync = require('../utils/catchAsync')
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

// flag 1 means we are checking for session present
// flag 0 means we are checking for session not present
const ifSessionPresent = (flag) => catchAsync(async (req, res, next) => {
    if(flag) {
        if(await Token.findOne()) {
            throw new ApiError(httpStatus.status.BAD_REQUEST, "Someone is already logged in");
        }
        next();
    } else {
        if(!await Token.findOne()) {
            throw new ApiError(httpStatus.status.BAD_REQUEST, "Someone is already logged in");
        }
        next();
    }
});

module.exports = ifSessionPresent;