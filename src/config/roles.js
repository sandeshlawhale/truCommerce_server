const allRoles = {
  user: ['register', 'login', 'logout', 'getProducts', 'getProductById', 'addItemsToCart', 'removeItemsFromCart', 'getCart', 'clearCart'],
  admin: ['getUsers', 'getUserByEmail', 'getUserById', 'deleteUserById', 'getProducts', 'createProduct', 'getProductById', 'updateProductById', 'deleteProductById']
};

module.exports = allRoles;