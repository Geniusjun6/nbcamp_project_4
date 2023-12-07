import express from 'express';
import { UsersController } from '../controllers/users.controller.js';

const router = express.Router();
const usersController = new UsersController;

/* 회원가입 */
router.post('/signup', usersController.signUp);

/* 로그인 */
router.post('/signin', usersController.signIn);

/* 사용자 조회 */
router.get('/users/userInfo', usersController.getUserInfo);

export default router;