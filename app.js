import express from "express"


const app = express();
const port = 3000

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
// git test