//register/signup;

//login;
//logout
//forgotPassword;
//resetPassword/otp;

import { Request, Response } from "express";
import User from "../../../Database/models/model.user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

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

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "email and password fields are required",
    });
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(404).json({
      message: "user not found",
    });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      message: "invalid password",
    });
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });

  return res.status(200).json({
    message: "login successful",
    token,
  });
};

export { registerUser, loginUser };
