import express from 'express';
export const router = express.Router();
import db from '../models/index.cjs';
const { Users } = db;

import bcrypt from 'bcryptjs'; // 비밀번호 암호화


// 회원가입 
router.post("/users", async (req, res) => {
  const { email, userName, password, confirmPassword } = req.body;
  try {
    // 이메일 형식이 아닐 경우 Error 메시지 발송
    const emailForm = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
    if (!emailForm.test(email)) {
      return res.status(400).json({ errorMessage: "이메일 형식이 올바르지 않습니다." });
    };

    // 동일한 email이 있을 경우 Error 메시지 발송
    const existUser = await Users.findOne({ where: { email } });
    if (existUser) {
      return res.status(400).json({ errorMessage: "이미 가입된 이메일 입니다." });
    };

    // 입력된 password 길이가 6자 미만일 경우 Error 메시지 발송
    if (password.length < 6) {
      return res.status(400).json({ errorMessage: "비밀번호는 최소 6자 이상 입력되어야 합니다." });
    };

    // password와 confirmPassword 값이 일치하지 않을 경우 Error 메시지 발송
    if (password !== confirmPassword) {
      return res.status(401).json({ errorMessage: "비밀번호를 확인해주세요." });
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

export default router;