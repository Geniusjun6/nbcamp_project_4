import express from 'express';
import db from '../models/index.cjs';
import authMiddleware from '../middlwares/need-signin.middlware.js';

const { Users } = db;
const router = express.Router();

// 사용자 조회 
router.get("/users/userInfo", authMiddleware, async (req, res) => {
  try {
    const { id } = res.locals.user;

    const user = await Users.findOne({
      attributes: ["id", "email", "createdAt", "updatedAt"],
      where: { id }
    });

    return res.status(200).json({ data: user });

  } catch (error) {
    console.error("사용자 조회 실패", error);
    res.status(500).json({ errorMessage: "사용자 조회에 실패했습니다." });
  }
})

export default router;