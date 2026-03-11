'use strict';

var server = require('server');

server.get('Show', function (req, res, next) {
    var productData = {
        title: 'Sample Product',
        price: '$19.99',
        stock: 'In stock',
        description: 'Simple product page placeholder for step-by-step workflow.'
    };

    res.render('product/productPage', productData);
    return next();
});

module.exports = server.exports();
