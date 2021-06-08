const express = require('express');
const productRoutes = require('./routes/products.route');
const globalRoutes = require('./routes/global.route');
const mongoose = require('mongoose');

// mongoose를 사용해서 nodejs와 mongodb를 연결
// database에 접속하는 ID와 패스워드를 테스트에서도 이렇게 노출하시면 안됩니다.
// 클라우드 계정이기 때문에 누군가 악의를 갖고 접근한다면 문제가 될 수 있으며
// 실제 프로덕션 환경에서는 이러한 키가 노출될 경우 해당 커밋내역 전체를 삭제해야 하는 불편함이 있습니다.
// 아시겠지만 dotenv 를 사용하여 env 변수로 지정하시는 편이 좋습니다. 
mongoose.connect('mongodb+srv://hyungilee:1q2w3e4r@cluster1.jgpwl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
        // 경고문구가 뜨지 않게 하기 위해서 아래 useNewUrlParser를 true로 설정
        useNewUrlParser: true,
        // Cluster의 모든 서버 모니터링을 처리하는 방법에 대한 refactoring 도입
        // 새로운 서버 검색 및 모니터링 엔진을 사용하기 위해 아래의 옵션 추가
        useUnifiedTopology: true
            // MongoDB에 연결을 성공했을때,
    }).then(() => console.log('Mongo DB is connected'))
    // MongoDB에 연결을 실패했을때,
    .catch(err => console.log(err));

const PORT = 5000;

const app = express();
// front-end 단에서 보내준 json형태의 데이터를 req.body로 읽어오기 위해
app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/', globalRoutes);
app.use((error, req, res, next) => {
    res.status(500).json({ message: error.message });
});

app.listen(PORT);
console.log(`Running on port ${PORT}`);

module.exports = app;
