const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const cartService = require("../services/cart.service");

const Cart = require("../models/cart.model");

const addItemsToCart = catchAsync(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await cartService.addItemsToCart(
    req.user.sub,
    productId,
    quantity
  );
  res.status(httpStatus.status.OK).send(cart);
});

const removeItemsFromCart = catchAsync(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await cartService.removeItemsFromCart(
    req.user.sub,
    productId,
    quantity
  );
  res.status(httpStatus.status.OK).send(cart);
});

const getCart = catchAsync(async (req, res) => {
  const cart = await cartService.getCart(req.user.sub);
  res.status(httpStatus.status.OK).send(cart);
});

const clearCart = catchAsync(async (req, res) => {
  const cart = await cartService.clearCart(req.user.sub);
  res.status(httpStatus.status.NO_CONTENT).send();
});

const updateCartQuantity = catchAsync(async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.sub; // Ensure this is correctly set from middleware

    if (!productId || quantity <= 0) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Invalid product ID or quantity"
      );
    }

    // Find the user's cart
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      throw new ApiError(httpStatus.NOT_FOUND, "Cart not found");
    }

    // Find the product in the cart
    const productIndex = cart.products.findIndex((item) =>
      item.productId.equals(productId)
    );

    if (productIndex === -1) {
      throw new ApiError(httpStatus.NOT_FOUND, "Product not found in cart");
    }

    // Update the quantity
    cart.products[productIndex].quantity = quantity;
    cart.updatedAt = new Date();

    // Save updated cart
    await cart.save();

    res
      .status(httpStatus.OK)
      .json({ message: "Cart updated successfully", cart });
  } catch (error) {
    console.log(error);
  }
});

module.exports = {
  addItemsToCart,
  removeItemsFromCart,
  getCart,
  clearCart,
  updateCartQuantity,
};
