const productModel = require('../models/Product');

exports.createProduct = () => {
    productModel.create();
};