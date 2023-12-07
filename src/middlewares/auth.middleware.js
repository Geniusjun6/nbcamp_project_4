import jwt from 'jsonwebtoken';

const authenticate = async (req, res, next) => {
  try {
    const { Authorization } = req.cookies;
    const [tokenType, token] = (Authorization ?? "").split(" ");

    // 토큰에 유저 정보를 담아서 데이터베이스 조회하는 프로세스를 줄이고자함
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Q.미들웨어에서의 에러처리는 에러핸들링 미들웨어를 안쓰나요..? 
    // 토큰 타입이 불일치 할 경우 (Bearer 가 아닐경우)
    if (tokenType !== "Bearer") {
      return res.status(401).json({ errorMessage: "토큰 타입이 일치하지 않습니다." });
    };

    res.locals.user = {
      userId: decodedToken.userId,
      userName: decodedToken.userName,
      email: decodedToken.email
    };
    next();

  } catch (error) {
    console.error(error);
    res.clearCookie("Authorization");

    // try 문에서 토큰 만료기간 유효성 검사가 계속 안되어서.. 에러 이름으로 catch에서 실행함
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ errorMessage: "토큰이 만료되었습니다." })
    };

    return res.status(401).json({ errorMessage: "로그인이 필요합니다." });
  };
}

export default authenticate;

