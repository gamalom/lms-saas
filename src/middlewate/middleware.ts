import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { User } from "../Database/models/model.user";
config();

interface IExtendedRequest extends Request {
  user?: User;
}

const isLoggedIn = (
  req: IExtendedRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "pls provide a token " });
  }
  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET as string,
    async (err, succcess: any) => {
      if (err) {
        return res.status(401).json({ message: "invalid token" });
      }

      console.log("successfully verified token");
      const user = await User.findByPk(succcess.id);
      if (!user) {
        return res.status(401).json({ message: "user not found" });
      }
      console.log("user found", user);
      req.user = user;
      next();
    },
  );
};

export default isLoggedIn;
