const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const productService = require("../services/product.service");
const ApiError = require("../utils/ApiError");

const createProduct = catchAsync(async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.status(httpStatus.status.CREATED).send(product);
});

const getProductById = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.productId);
  if (!product) {
    throw new ApiError(httpStatus.status.NOT_FOUND, "Product not found");
  }
  res.send(product);
});

const updateProductById = catchAsync(async (req, res) => {
  const product = await productService.updateProductById(
    req.params.productId,
    req.body
  );
  res.send(product);
});

const deleteProductById = catchAsync(async (req, res) => {
  await productService.deleteProductById(req.params.productId);
  res.status(httpStatus.status.NO_CONTENT).send();
});

const getProducts = catchAsync(async (req, res) => {
  const products = await productService.getProducts();
  res.send(products);
});

module.exports = {
  createProduct,
  getProductById,
  updateProductById,
  deleteProductById,
  getProducts,
};
