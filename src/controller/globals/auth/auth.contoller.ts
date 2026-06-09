//register/signup;

//login;
//logout
//forgotPassword;
//resetPassword/otp;

import { Request, Response } from "express";
import User from "../../../Database/models/model.user";
import bcrypt from "bcrypt";

const registerUser = async (req: Request, res: Response) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({
      message: "username, password and email fields are required",
    });
  }
  //insert into database
  const user = await User.create({
    username,
    password: bcrypt.hashSync(password, 10),
    email,
  });
  return res.status(201).json({
    message: "User created successfully",
    user,
  });
};

export { registerUser };
