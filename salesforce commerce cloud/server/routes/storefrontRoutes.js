const express = require('express');
const HomeController = require('../controllers/storefront/Home');
const ProductController = require('../controllers/storefront/Product');
const CartController = require('../controllers/storefront/Cart');
const AccountController = require('../controllers/storefront/Account');

const router = express.Router();

// Canonical storefront routes (Walmart implementation).
router.get('/', HomeController.showHome);
router.get('/walmart', HomeController.showHome);
router.get('/product/:id', ProductController.showProduct);
router.get('/cart', CartController.showCart);

// Keep the account page reachable from both the canonical route and older direct-template/SFRA-style URLs.
router.get(['/account', '/account/accountPage.html', '/Account-Show'], AccountController.showAccount);

module.exports = router;
