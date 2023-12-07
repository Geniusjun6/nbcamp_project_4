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

      // 프론트 코드 작성이 없기 때문에 백엔드에서 토큰을 쿠키에 넣어준다.
      res.cookie("Authorization", `Bearer ${token}`);
      return res.status(200).json({ message: "로그인에 성공했습니다." });
    } catch (error) {
      next(error);
    };
  };


  getUserInfo = async (req, res, next) => {
    try {
      const user = req.user;

      await this.usersService.getUserInfo(user);
    } catch (error) {
      next(error);
    };
  }

};