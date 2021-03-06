const { describe, test, expect } = require("@jest/globals");
const productController = require('../../controllers/products.controller');
// Create, Update, Delete를 하기 위해 필요한 model
const productModel = require('../../models/Product');
// 실제 데이터를 추가할때 사용할 req, res 객체 생성을 위한 node-mocks-http
const httpMocks = require('node-mocks-http');
// req.body에 추가해줄 newProduct json 데이터
const newProduct = require('../data/new-product.json');
// find test
const allProducts = require('../data/all-products.json');

// 단위 테스트이기 때문에 model에 직접적으로 영향을 받으면 안된다.(mock 함수 사용)
// mock 함수를 사용해서 호출되는 함수를 정의해주면, 
// 어떤 것에 의해서 호출되는지, 어떤 것과 함께 호출이 되는지 알 수 있다.
// 아래에서 productController.createProduct()가 호출되었을때, productModel.create가
// 호출이 되었는지 안되었는지 spy해서 추적할 수 있다.
// function spy
productModel.create = jest.fn();
productModel.find = jest.fn();
productModel.findById = jest.fn();
productModel.findByIdAndUpdate = jest.fn();
productModel.findByIdAndDelete = jest.fn();

const productId = "609a95d741bdf69a851ba718";
const updatedProduct = { name: 'updated name', description: 'updated description' };

let req, res, next;

// test case들의 공통된 부분을 선언해준다.
beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    // 비동기 요청에 대한 에러 응답을 처리하기 위해 next도 mock 함수로 작성해준다.
    next = jest.fn();
});

describe('Product Controller Create', () => {
    // product data를 데이터베이스에 추가할때 필요한 product객체를 
    // 넘겨받을 req 객체
    beforeEach(() => {
        req.body = newProduct;
    });
    test('should have a createProduct function', () => {
        expect(typeof productController.createProduct).toBe('function');
    });
    test('Should call ProductModel.create', async() => {
        // createProduct() 함수가 호출이 될때,
        // 위에서 httpMocks로 생성해준 req, res, next를 인수로 넘겨서
        // createProduct함수를 호출해준다. 
        await productController.createProduct(req, res, next);
        // productModel의 create 메소드가 같이 호출되는지 확인
        expect(productModel.create).toBeCalledWith(newProduct);
    });
    test('should return 201 response code', async() => {
        await productController.createProduct(req, res, next);
        expect(res.statusCode).toBe(201);
        expect(res._isEndCalled()).toBeTruthy();
    });
    test('should return json body in response', async() => {
        // mock 함수로 선언한 create 함수의 반환값을 mockReturnValue를 통해
        // 새로 추가한 product의 json 데이터를 반환하도록 지정한다.
        productModel.create.mockReturnValue(newProduct);
        // productController의 createProduct function의 인수로 
        // mock request, response, next의 값을 넣어서 호출한다.
        await productController.createProduct(req, res, next);
        // 호출한 결과, response 객체에 json data가 지정한 json 데이터 반환값과
        // 일치하는지 확인을 한다.
        expect(res._getJSONData()).toStrictEqual(newProduct);
    });

    /*
    mongo db에서 처리하는 부분은 문제가 없다는 것을 가정하는 단위테스트이기 때문에
    원래 mongo db에서 처리하는 에러 메시지 부분은 Mock 함수를 이용해서 처리한다.
    (잘 처리되고 있다고 가정)
    */
    test('should handle errors', async() => {
        const errorMessage = { message: 'description property missing' };
        // 인위적으로 에러메시지를 만들어서 전달한다.
        // Promise 객체에 담아서 전달해준다.
        // Promise.reject에 넣어주는 이유는 요청을 받
        const rejectedPromise = Promise.reject(errorMessage);
        productModel.create.mockReturnValue(rejectedPromise);
        await productController.createProduct(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
});


describe('Product Controller Get', () => {
    test('should have a getProducts function', () => {
        expect(typeof productController.getProducts).toBe("function");
    });
    // 모든 값을 조건 없이 가져오는 것을 테스트
    test('should call ProductModel.find({})', async() => {
        await productController.getProducts(req, res, next);
        expect(productModel.find).toHaveBeenCalledWith({});
    });
    test('should return 200 response', async() => {
        await productController.getProducts(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled).toBeTruthy();
    });
    test('should return json body in response', async() => {
        // 독립적으로 MongoDB에 종속되지 않고, 임의로 결과값을 만들어줘야 한다.
        productModel.find.mockReturnValue(allProducts);
        await productController.getProducts(req, res, next);
        expect(res._getJSONData()).toStrictEqual(allProducts);
    });
    test('should handle errors', async() => {
        const errorMessage = { message: "Error finding product data" };
        const rejectedPromise = Promise.reject(errorMessage);
        // find 함수로 호출시에 반환되는 결과값을 에러 메시지로 설정
        productModel.find.mockReturnValue(rejectedPromise);
        // MongoDB에서 데이터를 읽어오는 처리가 있는 controller function 호출
        await productController.getProducts(req, res, next);
        // next를 통해 에러가 전달되기 때문에 위에서 임의로 정의한 에러 메시지와 함께 
        // 정상적으로 next가 호출이 되는지 확인한다.
        expect(next).toHaveBeenCalledWith(errorMessage);
    });
});


describe('Product controller GetById', () => {
    test('should have a getProductById', () => {
        expect(typeof productController.getProductById).toBe('function');
    });
    test('should call productMode.findById', async() => {
        req.params.productId = productId;
        await productController.getProductById(req, res, next);
        expect(productModel.findById).toBeCalledWith(productId);
    });
    test('should return json body and response code 200', async() => {
        productModel.findById.mockReturnValue(newProduct);
        await productController.getProductById(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(newProduct);
        expect(res._isEndCalled()).toBeTruthy();
    });

    // 404 (존재하는 데이터가 없는 경우)
    test('should return 404 when item dosent exist', async() => {
        productModel.findById.mockReturnValue(null);
        await productController.getProductById(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();

    });
    test('should handle errors', async() => {
        const errorMessage = { message: 'error' };
        const rejectedPromise = Promise.reject(errorMessage);
        productModel.findById.mockReturnValue(rejectedPromise);
        await productController.getProductById(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    });
});


describe('Product Controller Update', () => {
    test('should have an updateProduct function', () => {
        expect(typeof productController.updateProduct).toBe('function');
    });
    test('should call productModel.findByIdAndUpdate', async() => {
        req.params.productId = productId;
        req.body = updatedProduct;
        await productController.updateProduct(req, res, next);
        // 필요한 인자로는 찾고자하는 id, 업데이트 하고자 하는 부분, 
        // 업데이트하고 난 뒤에 업데이트된 값을 반환되도록 설정({new: true})
        expect(productModel.findByIdAndUpdate).toHaveBeenCalledWith(
            productId, updatedProduct, { new: true }
        );
    });
    test('should return json body and response code 200', async() => {
        req.params.productId = productId;
        req.body = updatedProduct;
        productModel.findByIdAndUpdate.mockReturnValue(updatedProduct);
        // 실제 메서드 실행
        await productController.updateProduct(req, res, next);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(updatedProduct);
    });

    // update 하려는 객체의 id가 존재하지 않은 경우, 
    test('should handle 404 when item doesnt exist', async() => {
        // 업데이트하려는 객체가 존재하지 않기 때문에 반환값을 null로 설정
        productModel.findByIdAndUpdate.mockReturnValue(null);
        await productController.updateProduct(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    })

    // 데이터를 업데이트할때 에러가 발생하는 경우
    test('should handle errors', async() => {
        const errorMessage = { message: "Error" };
        const rejectPromise = Promise.reject(errorMessage);
        // Promise.reject()를 반환값으로 설정했기 때문에 catch 구문으로 처리가 된다.
        productModel.findByIdAndUpdate.mockReturnValue(rejectPromise);
        await productController.updateProduct(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    });
});

// delete 단위 테스트
describe('Product controller delete', () => {
    test('should have a deleteProduct function', () => {
        expect(typeof productController.deleteProduct).toBe("function");
    });
    test('should call ProductModel.findByIdAndDelete', async() => {
        req.params.productId = productId;
        // req 내에 productId가 params로 같이 들어간다. 
        await productController.deleteProduct(req, res, next);
        expect(productModel.findByIdAndDelete).toBeCalledWith(productId);
    });
    test('should return 200 response', async() => {
        let deletedProduct = {
                name: "deletedProduct",
                description: "it is deleted"
            }
            // 값을 지운다음에 삭제된 데이터를 반환하도록 값을 설정
        productModel.findByIdAndDelete.mockReturnValue(deletedProduct);
        await productController.deleteProduct(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(deletedProduct);
        expect(res._isEndCalled()).toBeTruthy();
    });

    // 삭제하고자 하는 데이터가 데이터베이스에 존재하지 않는 경우
    test('should handle 404 when item doesnt exist', async() => {
        productModel.findByIdAndDelete.mockReturnValue(null);
        await productController.deleteProduct(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    });
    test('should handle errors', async() => {
        const errorMessage = { message: "Error deleting" };
        const rejectedPromise = Promise.reject(errorMessage);
        productModel.findByIdAndDelete.mockReturnValue(rejectedPromise);
        await productController.deleteProduct(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    });
});