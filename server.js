const express = require('express');
const productRoutes = require('./routes/products.route');
const globalRoutes = require('./routes/global.route');

const PORT = 5000;

const app = express();
// front-end 단에서 보내준 json형태의 데이터를 req.body로 읽어오기 위해
app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/', globalRoutes);


app.listen(PORT);
console.log(`Running on port ${PORT}`);