//register/signup;

//login;
//logout
//forgotPassword;
//resetPassword/otp;

import { Request, Response } from "express";
import User from "../../../Database/models/model.user";

const registerUser = async (req: Request, res: Response) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }
  //insert into database
  const user = await User.create({ username, password, email });
  return res.status(201).json({
    message: "User created successfully",
    user,
  });
};

export { registerUser };
