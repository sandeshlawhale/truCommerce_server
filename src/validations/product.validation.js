const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createProduct = {
  body: Joi.object().keys({
    name: Joi.string().required().trim(),
    description: Joi.string().required().trim(),
    price: Joi.number().required().min(0),
    imageUrl: Joi.string().required().trim()
  }),
};

const getProductById = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

const updateProductById = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().trim(),
      description: Joi.string().trim(),
      price: Joi.number().min(0),
      imageUrl: Joi.string().required().trim()
    })
    .min(1), // Ensure at least one field is provided for update
};

const deleteProductById = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createProduct,
  getProductById,
  updateProductById,
  deleteProductById,
};