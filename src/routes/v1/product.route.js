const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const productValidation = require("../../validations/product.validation");
const productController = require("../../controllers/product.controller");
const { authorizeJwt, authorizeRoles } = require("../../middlewares/auth");
const router = express.Router();

router
  .route("/")
  .get(productController.getProducts) // get Products
  .post(
    authorizeJwt(),
    authorizeRoles(["createProduct"]),
    validate(productValidation.createProduct),
    productController.createProduct
  );

router
  .route("/:productId")
  .get(
    authorizeJwt(),
    authorizeRoles(["getProductById"]),
    validate(productValidation.getProductById),
    productController.getProductById
  ) // get product by Id
  .put(
    authorizeJwt(),
    authorizeRoles(["updateProductById"]),
    validate(productValidation.updateProductById),
    productController.updateProductById
  ) // update product by Id
  .delete(
    authorizeJwt(),
    authorizeRoles(["deleteProductById"]),
    validate(productValidation.deleteProductById),
    productController.deleteProductById
  ); // delete product by Id

module.exports = router;
