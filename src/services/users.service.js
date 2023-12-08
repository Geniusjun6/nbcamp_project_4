import { UsersRepository } from '../repositories/users.repository.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ValidationError } from '../middlewares/error.middleware.js';

export class UsersService {
  usersRepository = new UsersRepository();

  signUpUser = async (email, userName, password, confirmPassword) => {

    // 이메일 형식이 아닐 경우 Error 메시지 발송
    const emailForm = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
    if (!emailForm.test(email)) {
      throw new ValidationError("이메일 형식이 올바르지 않습니다.", 400);
    };

    // 입력 받는 데이터가 없는 경우 ! 
    if (!email || !userName || !password) {
      throw new ValidationError("가입 정보를 모두 입력해주세요.", 400);
    };

    const existUser = await this.usersRepository.findUserByEmail(email);

    // 기존 유저가 있을 경우
    if (existUser) {
      throw new ValidationError("이미 가입된 이메일 입니다.", 400);
    };

    // 입력된 password 길이가 6자 미만일 경우 Error 메시지 발송
    if (password.length < 6) {
      throw new ValidationError("비밀번호는 최소 6자 이상 입력되어야 합니다.", 400);
    };

    // password와 confirmPassword 값이 일치하지 않을 경우 Error 메시지 발송
    if (password !== confirmPassword) {
      throw new ValidationError("비밀번호를 확인해주세요.", 401);
    };

    // 해쉬된 비밀번호를 이용하여 데이터베이스에 저장한다.
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.usersRepository.signupUser(
      email,
      userName,
      hashedPassword);

    return {
      userId: newUser.userId,
      userName: newUser.userName,
      email: newUser.email,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt
    };
  };


  signIn = async (email, password) => {

    // 이메일과 비밀번호를 입력하지 않았을 때
    if (!email || !password) {
      throw new ValidationError("이메일 또는 비밀번호를 입력해주세요.", 400);
    };

    const user = await this.usersRepository.findUserByEmail(email);

    // 찾은 유저가 없거나 비밀번호가 다를경우 
    // compare 메서드를 통해서 해쉬된 비밀번호와 비교
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new ValidationError("이메일 또는 비밀번호를 확인해주세요.", 401);
    };

    // 로그인 시 토큰 생성 
    const token = jwt.sign({
      userName: user.userName,
      userId: user.userId,
      email: user.email
    }, process.env.JWT_SECRET_KEY, { expiresIn: "12h" });

    return token;
  };


  getUserInfo = async (user) => {
    if (!user) {
      throw new ValidationError("유저를 찾을 수 없습니다.", 404);
    };

    return {
      userId: user.userId,
      email: user.email,
      userName: user.userName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  };
};