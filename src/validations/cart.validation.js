const Joi = require("joi");
const { objectId } = require("./custom.validation");

const addItemsToCart = {
  body: Joi.object().keys({
    productId: Joi.string().custom(objectId).required(),
    quantity: Joi.number().integer().min(1).required(),
  }),
};

const removeItemsFromCart = {
  body: Joi.object().keys({
    productId: Joi.string().custom(objectId).required(),
    quantity: Joi.number().integer().min(0).required(),
  }),
};

const getCart = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
};

const clearCart = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  addItemsToCart,
  removeItemsFromCart,
  getCart,
  clearCart,
};
