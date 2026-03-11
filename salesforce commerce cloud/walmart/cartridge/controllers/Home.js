'use strict';

/**
 * Step 1 - Home page purpose note:
 * This page introduces the Walmart store, helps shoppers start shopping,
 * and guides product discovery through categories and featured products.
 */

var server = require('server');

server.get('Show', function (req, res, next) {
    var homepageData = {
        storeName: 'Walmart',
        welcomeMessage: 'Shop everyday essentials',
        categories: ['Grocery', 'Electronics', 'Fashion', 'Home', 'Pharmacy'],
        featuredProducts: [
            { id: 'sku-1001', title: 'Fresh Apples', price: '$4.99', image: 'Image Placeholder' },
            { id: 'sku-1002', title: 'Wireless Earbuds', price: '$29.99', image: 'Image Placeholder' },
            { id: 'sku-1003', title: 'Cotton T-Shirt', price: '$12.99', image: 'Image Placeholder' }
        ]
    };

    res.render('home/homePage', homepageData);
    return next();
});

module.exports = server.exports();
