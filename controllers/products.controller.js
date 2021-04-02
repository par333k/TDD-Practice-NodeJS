const productModel = require('../models/Product');

exports.createProduct = (req, res, next) => {
    const newProduct = productModel.create(req.body);
    res.status(201).json(newProduct);
};