const Product = require("../models/product.model");
const { ifDataDontExists } = require("../utils/serviceUtil");

const getProducts = async () => {
  const products = await Product.find();
  return products;
};

const createProduct = async (productBody) => {
  const product = await Product.create(productBody);
  return ifDataDontExists(product);
};

const getProductById = async (id) => {
  const product = await Product.findById(id);
  return ifDataDontExists(product);
};

const updateProductById = async (productId, updateBody) => {
  const product = await getProductById(productId);
  ifDataDontExists(product);
  Object.assign(product, updateBody);
  await product.save();
  return product;
};

const deleteProductById = async (productId) => {
  const product = await getProductById(productId);
  ifDataDontExists(product);
  await product.deleteOne();
  return product;
};

module.exports = {
  createProduct,
  getProductById,
  updateProductById,
  deleteProductById,
  getProducts,
};
