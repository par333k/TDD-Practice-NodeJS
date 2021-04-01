const { describe, test, expect } = require("@jest/globals");
const productController = require('../../controllers/products.controller');
const productModel = require('../../models/Product');

// 단위 테스트이기 때문에 model에 직접적으로 영향을 받으면 안된다.(mock 함수 사용)
// mock 함수를 사용해서 호출되는 함수를 정의해주면, 
// 어떤 것에 의해서 호출되는지, 어떤 것과 함께 호출이 되는지 알 수 있다.
// 아래에서 productController.createProduct()가 호출되었을때, productModel.create가
// 호출이 되었는지 안되었는지 spy해서 추적할 수 있다.
productModel.create = jest.fn();

describe('Product Controller Create', () => {
    test('should have a createProduct function', () => {
        expect(typeof productController.createProduct).toBe('function');
    });
    test('Should call ProductModel.create', () => {
        // createProduct() 함수가 호출이 될때,
        productController.createProduct();
        // productModel의 create 메소드가 같이 호출되는지 확인
        expect(productModel.create).toBeCalledWith();
    });
});