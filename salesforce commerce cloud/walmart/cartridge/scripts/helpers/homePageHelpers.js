'use strict';

function getHomeCategories() {
    return ['Grocery', 'Electronics', 'Fashion', 'Home', 'Pharmacy'];
}

function getFeaturedProducts() {
    return [
        {
            id: 'sku-1001',
            title: 'Fresh Apples',
            price: '$4.99',
            image: '../../../client/default/images/products/fresh-apples.svg'
        },
        {
            id: 'sku-1002',
            title: 'Wireless Earbuds',
            price: '$29.99',
            image: '../../../client/default/images/products/wireless-earbuds.svg'
        },
        {
            id: 'sku-1003',
            title: 'Cotton T-Shirt',
            price: '$12.99',
            image: '../../../client/default/images/products/cotton-tshirt.svg'
        }
    ];
}

module.exports = {
    getHomeCategories: getHomeCategories,
    getFeaturedProducts: getFeaturedProducts
};
