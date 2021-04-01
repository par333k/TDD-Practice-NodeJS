const { describe, test, expect } = require("@jest/globals");
const productController = require('../../controllers/products.controller');

describe('Product Controller Create', () => {
    test('should have a createProduct function', () => {
        expect(typeof productController.createProduct).toBe('function');
    });
});