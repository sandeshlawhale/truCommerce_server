const express = require('express');
// const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');
const { authorizeJwt, authorizeRoles } = require('../../middlewares/auth')
const router = express.Router();

router
  .route('/')
  .get(authorizeJwt(), authorizeRoles(['getUsers']), userController.getUsers);

router
  .route('/:userId')
  .get(authorizeJwt(), authorizeRoles(['getUserById']), validate(userValidation.getUser), userController.getUser)
  // .put(validate(userValidation.updateUser), userController.updateUser)
  .delete(authorizeJwt(), authorizeRoles(['deleteUserById']), validate(userValidation.deleteUser), userController.deleteUser);

module.exports = router;
