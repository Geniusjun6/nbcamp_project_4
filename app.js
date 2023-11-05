import express from "express"
import dotenv from 'dotenv'; // .env 패키지를 사용하기 위해 불러오고 실행함
dotenv.config();

const app = express();
const port = process.env.PORT;

import connect from "./schemas/index.js";
connect();

import productsRouter from "./routes/products.router.js"

app.use(express.json());

app.get('/', (req, res) => {
  res.send("Geniusjun6 Store !!")
});

app.listen(port, () => {
  console.log(port, '포트 연결 성공 !');
})

app.use('/products', [productsRouter]); // productRouter를 사용하기 위한 미들웨어