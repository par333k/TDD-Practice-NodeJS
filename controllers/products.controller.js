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
        console.log('createProduct', newProduct);
        res.status(201).json(newProduct);
    } catch (error) {
        next(error);
    }
};