const productModel = require('../models/Product');

// 성공한 케이스에 대한 코드
// exports.createProduct = async(req, res, next) => {
//     const newProduct = await productModel.create(req.body);
//     console.log('createProduct', newProduct);
//     res.status(201).json(newProduct);
// };

// 비동기 요청에 대한 에러 발생에 대한 예외처리
exports.createProduct = async(req, res, next) => {
    try {
        const newProduct = await productModel.create(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        next(error);
    }
};

exports.getProducts = async(req, res, next) => {
    try {
        const allProducts = await productModel.find({});
        res.status(200).json(allProducts);
    } catch (error) {
        next(error);
    }
};

exports.getProductById = async(req, res, next) => {
    try {
        const product = await productModel.findById(req.params.productId);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).send();
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
};

// { new: true}는 업데이트된 객체의 값이 반환될 수 있도록 하는 옵션(default는 false로 설정되어있다.)
exports.updateProduct = async(req, res, next) => {
    try {
        let updatedProduct = await productModel.findByIdAndUpdate(
            req.params.productId,
            req.body, { new: true }
        );
        if (updatedProduct) {
            res.status(200).json(updatedProduct);
        } else {
            // res._isEndCalled()가 toBeTruthy()이기 때문에
            res.status(404).send();
        }
    } catch (error) {
        next(error);
    }
};