const express = require('express');
const router = express.Router();
const productController = require('../controllers/products.controller');

router.get('/', productController.getProducts);
router.post('/', productController.createProduct);

module.exports = router;