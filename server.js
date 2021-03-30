const express = require('express');

const PORT = 5000;

const app = express();
// front-end 단에서 보내준 json형태의 데이터를 req.body로 읽어오기 위해
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(PORT);
console.log(`Running on port ${PORT}`);