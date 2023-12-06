import express from "express"
import cookieParser from "cookie-parser";
import productsRouter from "./routers/products.router.js";
// import authRouter from "./routes/auth.router.js";
// import userRouter from "./routes/users.router.js";

const app = express();
const port = 3000

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', [productsRouter]);


app.listen(port, () => {
  console.log(port, '포트 연결 성공 !');
})

