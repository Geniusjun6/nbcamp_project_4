import express from 'express';
import db from '../models/index.cjs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();
const { Users } = db;

// 회원가입 //
router.post("/users", async (req, res) => {
  const { email, userName, password, confirmPassword } = req.body;
  try {
    // 이메일 형식이 아닐 경우 Error 메시지 발송
    const emailForm = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
    if (!emailForm.test(email)) {
      res.status(400).json({ errorMessage: "이메일 형식이 올바르지 않습니다." });
      return;
    };

    // 동일한 email이 있을 경우 Error 메시지 발송
    const existUser = await Users.findOne({ where: { email } });
    if (existUser) {
      res.status(400).json({ errorMessage: "이미 가입된 이메일 입니다." });
      return;
    };

    // 입력된 password 길이가 6자 미만일 경우 Error 메시지 발송
    if (password.length < 6) {
      res.status(400).json({ errorMessage: "비밀번호는 최소 6자 이상 입력되어야 합니다." });
      return;
    };

    // password와 confirmPassword 값이 일치하지 않을 경우 Error 메시지 발송
    if (password !== confirmPassword) {
      res.status(401).json({ errorMessage: "비밀번호를 확인해주세요." });
      return;
    };

    // 유효성 검사 후 신규 유저 생성
    const newUser = await Users.create({ email, password, userName }); // 여기에서 password를 빼면 db에 password가 null 값
    const resUser = { ...newUser.get(), password: undefined }; // 응답용 객체를 만들어서 해당 객체를 응답
    return res.status(201).json({ resUser });

  } catch (error) {
    console.error("회원가입 실패", error);
    res.send(500).json({ errorMessage: "회원가입에 실패했습니다." });
  };
});


// 로그인 //
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ where: { email } });

    // email이 없을 경우 (기존 회원이 아닌 경우) or 비밀번호를 잘못 입력하였을 경우
    // 비밀번호 비교 시 bcrypt.compare 메서드를 통해 해싱 진행
    if (!user || !(await bcrypt.compare(password, user.password))) { // 모델에 집어넣어보기? 
      res.status(401).json({ errorMessage: "이메일 또는 비밀번호를 확인해주세요." });
      return;
    };

    // 로그인 시 jwt 토큰 생성 생성
    const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, { expiresIn: "12h" });
    res.cookie("authorization", `Bearer ${token}`);

    return res.status(200).json({ message: "로그인에 성공했습니다." });

  } catch (error) {
    console.error("로그인 실패", error);
    res.status(500).json({ errorMessage: "로그인을 다시 시도해주세요." })
  };
});

export default router;