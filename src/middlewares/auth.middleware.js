import jwt from 'jsonwebtoken';

const authenticate = async (req, res, next) => {
  try {
    const { Authorization } = req.cookies;
    const [tokenType, token] = (Authorization ?? "").split(" ");

    // 토큰 타입이 불일치 할 경우 (Bearer 가 아닐경우)
    if (tokenType !== "Bearer") {
      throw new Error("토큰 타입이 일치하지 않습니다.");
    };

    // 토큰에 유저 정보를 담아서 데이터베이스 조회하는 프로세스를 줄이고자함
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decodedToken) {
      throw new Error("유효하지 않은 토큰입니다.");
    };

    res.locals.user = {
      userId: decodedToken.userId,
      userName: decodedToken.userName,
      email: decodedToken.email
    };
    next();

  } catch (error) {
    res.clearCookie("Authorization");
    next(error);
  };
}

export default authenticate;

