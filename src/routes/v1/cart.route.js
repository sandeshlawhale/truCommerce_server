const express = require("express");
const validate = require("../../middlewares/validate");
const cartController = require("../../controllers/cart.controller");
const cartValidation = require("../../validations/cart.validation");
const { authorizeJwt, authorizeRoles } = require("../../middlewares/auth");

const router = express.Router();

router
  .route("/")
  .post(
    authorizeJwt(),
    authorizeRoles(["addItemsToCart"]),
    validate(cartValidation.addItemsToCart),
    cartController.addItemsToCart
  )
  .delete(
    authorizeJwt(),
    //   (req, res)=>{
    //     console.log('hello===>>>', req.body)

    //   }
    authorizeRoles(["removeItemsFromCart"]),
    validate(cartValidation.removeItemsFromCart),
    cartController.removeItemsFromCart
  );

router.route("/update").put(authorizeJwt(), cartController.updateCartQuantity);

router
  .route("/:userId")
  .get(
    authorizeJwt(),
    authorizeRoles(["getCart"]),
    validate(cartValidation.getCart),
    cartController.getCart
  )
  .delete(
    authorizeJwt(),
    authorizeRoles(["clearCart"]),
    validate(cartValidation.clearCart),
    cartController.clearCart
  );

module.exports = router;

// /cart - post
// /cart - delete

// /cart/products/:itemId - delete - { itemId: xxx, quantity: 123 }
// /cart/:userId/:itemId - add - { itemId: xxx, quantity: 123 }
// /cart/:userId/

// users/:userId/cart/
