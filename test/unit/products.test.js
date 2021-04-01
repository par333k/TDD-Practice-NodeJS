const { describe, test, expect } = require("@jest/globals");
const productController = require('../../controllers/products.controller');
// Create, Update, Delete를 하기 위해 필요한 model
const productModel = require('../../models/Product');
// 실제 데이터를 추가할때 사용할 req, res 객체 생성을 위한 node-mocks-http
const httpMocks = require('node-mocks-http');
// req.body에 추가해줄 newProduct json 데이터
const newProduct = require('../data/new-product.json');

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
        // product data를 데이터베이스에 추가할때 필요한 product객체를 
        // 넘겨받을 req 객체
        let req = httpMocks.createRequest();
        let res = httpMocks.createResponse();
        let next = null;
        req.body = newProduct;
        // createProduct() 함수가 호출이 될때,
        // 위에서 httpMocks로 생성해준 req, res, next를 인수로 넘겨서
        // createProduct함수를 호출해준다. 
        productController.createProduct(req, res, next);
        // productModel의 create 메소드가 같이 호출되는지 확인
        expect(productModel.create).toBeCalledWith(newProduct);
    });
});