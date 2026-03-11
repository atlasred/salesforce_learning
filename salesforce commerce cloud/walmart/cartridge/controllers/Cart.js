'use strict';

var server = require('server');

server.get('Show', function (req, res, next) {
    var cartData = {
        items: [
            { title: 'Sample Product', quantity: 1, price: '$19.99' }
        ],
        subtotal: '$19.99'
    };

    res.render('cart/cartPage', cartData);
    return next();
});

module.exports = server.exports();
