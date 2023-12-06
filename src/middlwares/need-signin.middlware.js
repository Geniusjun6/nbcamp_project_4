// import jwt from 'jsonwebtoken';
// import db from '../models/index.cjs';
// const { Users } = db;
// import dotenv from 'dotenv'; // .env 패키지를 사용하기 위해 불러오고 실행함
// dotenv.config();

// const authenticate = async (req, res, next) => {
//   try {
//     const { Authorization } = req.cookies;
//     const [tokenType, token] = (Authorization ?? "").split(" ");

//     const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
//     const id = decodedToken.userId;
//     const user = await Users.findOne({ where: { id } });

//     // 토큰 사용자가 존재하지 않을 경우
//     if (!user) {
//       res.clearCookie("Authorization");
//       return res.status(401).json({ errorMessage: "사용자가 존재하지 않습니다." });
//     };

//     // 토큰 타입이 불일치 할 경우 (Bearer 가 아닐경우)
//     if (tokenType !== "Bearer") {
//       return res.status(401).json({ errorMessage: "토큰 타입이 일치하지 않습니다." });
//     };

//     res.locals.user = user;
//     next();

//   } catch (error) {
//     console.error(error);
//     res.clearCookie("Authorization");

//     // try 문에서 토큰 만료기간 유효성 검사가 계속 안되어서.. 에러 이름으로 catch에서 실행함
//     if (error.name === 'TokenExpiredError') {
//       return res.status(401).json({ errorMessage: "토큰이 만료되었습니다." })
//     };

//     return res.status(401).json({ errorMessage: "로그인이 필요합니다." });
//   };
// }

// export default authenticate;

