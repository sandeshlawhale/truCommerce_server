const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

const addItemsToCart = async (userId, productId, quantity) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, products: [] });
  }

  // Ensure that productId exists before calling toString()
  const itemIndex = cart.products.findIndex(
    (item) => item.productId && item.productId.toString() === productId.toString()
  );
  if (itemIndex > -1) {
    cart.products[itemIndex].quantity += quantity;
  } else {
    cart.products.push({ productId, quantity });
  }

  await cart.save();
  return cart;
};


const removeItemsFromCart = async (userId, productId, quantity) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, "Cart not found");
  }

  // Ensure that productId exists before calling toString()
  const itemIndex = cart.products.findIndex(
    (item) => item.productId && item.productId.toString() === productId.toString()
  );

  if (itemIndex === -1) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found in cart");
  }

  const currentQuantity = cart.products[itemIndex].quantity;

  if (quantity > currentQuantity) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Provided quantity exceeds available quantity"
    );
  }

  if (currentQuantity - quantity === 0) {
    cart.products.splice(itemIndex, 1);
  } else {
    cart.products[itemIndex].quantity -= quantity;
  }

  await cart.save();
  return cart;
};

const getCart = async (userId) => {
  // the populate method is used to print the whole details of the product
  // for every corresponding productId
  let cart = await Cart.findOne({ userId }).populate("products.productId");
  if (!cart) {
    cart = new Cart({ userId, products: [] });
    await cart.save();
    return cart;
  }
  return cart;
};

const clearCart = async (userId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new ApiError(httpStatus.status.NOT_FOUND, "Cart not found");
  }

  cart.products = [];
  await cart.save();
  return cart;
};

module.exports = {
  addItemsToCart,
  removeItemsFromCart,
  getCart,
  clearCart,
};
