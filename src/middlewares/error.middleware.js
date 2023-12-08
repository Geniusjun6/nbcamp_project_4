export class ValidationError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.name = "ValidationError"
    this.statusCode = statusCode
  };
};

const errorHandling = async (err, req, res, next) => {
  console.error(err);

  /* 예상치 못한 에러가 발생했을 경우 500코드와 에러 메시지 반환 */
  if (!err.statusCode) {
    return res.status(500).json({ message: "알 수 없는 에러가 발생했습니다. 관리자에게 문의하세요." });
  }

  /* 그 외 상황에 맞는 상태코드와 에러 메세지 반환 */
  return res.status(err.statusCode).json({ message: err.message });
};

export default errorHandling;
