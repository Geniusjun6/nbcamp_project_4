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
      await this.usersService.signIn(email, password);

      return res.status(200).json({ message: "로그인에 성공했습니다." });
    } catch (error) {
      next(error);
    };
  };


};