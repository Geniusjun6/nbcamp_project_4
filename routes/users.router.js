import express from 'express';
export const router = express.Router();

import User from '../schemas/users.model.js';
import bcryptjs from 'bcryptjs'; // 비밀번호 암호화


