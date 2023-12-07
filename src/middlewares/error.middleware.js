const errorHandling = async (err, req, res, next) => {
  console.error(err);
  let statusCode = 0

  switch (err.message) {
    /* 회원가입 유효성 검사 */
    case "이메일 형식이 올바르지 않습니다.":
      statusCode = 400;
      break;

    case "가입 정보를 모두 입력해주세요.":
      statusCode = 400;
      break;

    case "이미 가입된 이메일 입니다.":
      statusCode = 400;
      break;

    case "비밀번호는 최소 6자 이상 입력되어야 합니다.":
      statusCode = 400;
      break;

    case "비밀번호를 확인해주세요.":
      statusCode = 401;
      break;


    /* 로그인 유효성 검사 */
    case "이메일 또는 비밀번호를 입력해주세요.":
      statusCode = 400;
      break;

    case "이메일 또는 비밀번호를 확인해주세요.":
      statusCode = 401;
      break;


    /* 유저 조회 시 유효성 검사 */
    case "유저를 찾을 수 없습니다.":
      statusCode = 404;
      break;


    /* 상품 생성 시 유효성 검사 */
    case "상품 정보를 모두 입력해주세요.":
      statusCode = 400;
      break;

    case "존재하는 상품이 없습니다.":
      statusCode = 404;
      break;

    case "권한이 없습니다.":
      statusCode = 403
      break;


    /* auth 미들웨어 유효성 검사 */
    case "jwt expired":
      statusCode = 401;
      err.message = "토큰이 만료되었습니다.";
      break;

    case "토큰 타입이 일치하지 않습니다.":
      statusCode = 401;
      break;

    case "유효하지 않은 토큰입니다.":
      statusCode = 401;
      break;



    default:
      statusCode = 500;
      err.message = "알 수 없는 오류가 발생했습니다. 관리자에게 문의하세요."
      break;
  };

  return res.status(statusCode).json({ message: err.message });
};
export default errorHandling;
