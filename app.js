import express from "express"
import db from './models/index.cjs';
import connect from "./schemas/index.js";
connect();
import productsRouter from "./routes/products.router.js"

const app = express();
const port = 3000

app.use(express.json());

// app.get('/', (req, res) => {
//   res.send("Geniusjun6 Store !!")
// });

try {
  await db.sequelize.authenticate();
  console.log('sequelize 연결이 완료되었습니다.');
} catch (error) {
  console.error("sequelize 연결에 실패했습니다.", error);
}

app.listen(port, () => {
  console.log(port, '포트 연결 성공 !');
})

app.use('/api', [productsRouter]); // productRouter를 사용하기 위한 미들웨어
// git test