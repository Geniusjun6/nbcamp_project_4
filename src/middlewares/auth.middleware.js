import jwt from 'jsonwebtoken';
import { ValidationError } from './error.middleware.js';

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const [tokenType, accessToken] = (token ?? "").split(" ");

    // 토큰 타입이 불일치 할 경우 (Bearer 가 아닐경우)
    if (tokenType !== "Bearer") {
      throw new ValidationError("토큰 타입이 일치하지 않습니다.", 401);
    };

    // 토큰에 유저 정보를 담아서 데이터베이스 조회하는 프로세스를 줄이고자함
    const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);

    res.locals.user = {
      userId: decodedToken.userId,
      userName: decodedToken.userName,
      email: decodedToken.email
    };
    next();

  } catch (error) {

    if (error instanceof jwt.TokenExpiredError) {
      next(new ValidationError("만료된 토큰입니다.", 401));
    };

    if (error instanceof jwt.JsonWebTokenError) {
      next(new ValidationError("유효하지 않은 토큰입니다.", 401));
    };

    next(error);
  };
}

export default authenticate;

