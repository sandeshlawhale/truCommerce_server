const ApiError = require('./ApiError');
const logger = require('../config/logger');
const httpStatus = require('http-status');

const ifDataDontExists = async (object) => { 
  if (!object) {
    logger.error('Product not found');    
    throw new ApiError(httpStatus.status.NOT_FOUND, 'Product not found');
  }
  return object;
}

module.exports = { ifDataDontExists } ;