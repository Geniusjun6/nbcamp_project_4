import express from 'express';
export const router = express.Router();

import User from '../schemas/users.model.js';
import bcryptjs from 'bcryptjs'; // 비밀번호 암호화


// 회원가입 
router.post("/users", async (req, res) => {
  const { email, nickname, password, confirmPassword } = req.body;

  // password와 confirmPassword 값이 일치
  if (password !== confirmPassword) {
    res.status(400).json({ errorMessage: "비밀번호를 확인해주세요." });
    return
  };
  // email에 해당하는 사용자가 있는가? 



})