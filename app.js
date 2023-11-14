import express from "express"
import db from './models/index.cjs';
import cookieParser from "cookie-parser";
import productsRouter from "./routes/products.router.js";
import userRouter from "./routes/users.router.js";


const app = express();
const port = 3000

app.use(express.json());
app.use(cookieParser());

try {
  await db.sequelize.authenticate();
  console.log('sequelize 연결이 완료되었습니다.');
} catch (error) {
  console.error("sequelize 연결에 실패했습니다.", error);
}

app.use('/api', [productsRouter, userRouter]); // productRouter를 사용하기 위한 미들웨어


app.listen(port, () => {
  console.log(port, '포트 연결 성공 !');
})