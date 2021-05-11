const request = require('supertest');
const app = require('../../server');
const newProduct = require('../data/new-product.json');

test('POST /api/products', async() => {
    const response = await request(app)
        .post('/api/products')
        .send(newProduct);
    expect(response.statusCode).toBe(201);
    // express.json() middleware 덕분에 body로 들어올 수 있다.
    expect(response.body.name).toBe(newProduct.name)
    expect(response.body.description).toBe(newProduct.description)
});

test('should return 500 on POST /api/products', async() => {
    const response = await request(app)
        .post('/api/products')
        // 에러를 인위적으로 발생시키기 위해 아래와 같은 데이터 전달
        .send({ name: "phone" });
    expect(response.statusCode).toBe(500);
    console.log('response.body', response.body)
    expect(response.body).toStrictEqual({ message: "Product validation failed: description: Path `description` is required." })
});