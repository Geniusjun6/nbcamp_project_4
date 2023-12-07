import express from "express"
import cookieParser from "cookie-parser";
import productsRouter from "./routers/products.router.js";
// import authRouter from "./routes/auth.router.js";
import userRouter from "./routers/users.router.js";

import dotenv from 'dotenv'; // .env 패키지를 사용하기 위해 불러오고 실행함
dotenv.config();

const app = express();
const port = 3000

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', [userRouter]);


app.listen(port, () => {
  console.log(port, '포트 연결 성공 !');
})

