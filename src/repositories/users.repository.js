import { prisma } from "../utils/prisma/index.js"

export class UsersRepository {
  signupUser = async (email, userName, hashedPassword) => {
    const newUser = await prisma.Users.create({
      data: {
        email,
        userName,
        password: hashedPassword,
      }
    });
    return newUser;
  };

  findUserByEmail = async (email) => {
    const user = await prisma.Users.findFirst({
      where: { email }
    });
    return user;
  };
};