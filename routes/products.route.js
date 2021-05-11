const express = require('express');
const router = express.Router();
const productController = require('../controllers/products.controller');

router.get('/', productController.getProducts);
router.post('/', productController.createProduct);
router.get('/:productId', productController.getProductById);
router.put('/:productId', productController.updateProduct);

module.exports = router;