import { UsersService } from "../services/users.service.js";

export class UsersController {
  usersService = new UsersService();

  signUp = async (req, res, next) => {
    try {
      const { email, userName, password, confirmPassword } = req.body;

      const signupUser = await this.usersService.signUpUser(
        email,
        userName,
        password,
        confirmPassword
      );

      return res.status(201).json({ data: signupUser });

    } catch (error) {
      next(error);
    };
  };

  signIn = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const token = await this.usersService.signIn(email, password);

      return res.status(200).json({ message: "로그인에 성공했습니다.", token });
    } catch (error) {
      next(error);
    };
  };


  getUserInfo = async (req, res, next) => {
    try {
      const user = res.locals.user;

      await this.usersService.getUserInfo(user);
      return res.status(200).json({ message: "유저 정보 조회에 성공했습니다.", user });
    } catch (error) {
      next(error);
    };
  }

};