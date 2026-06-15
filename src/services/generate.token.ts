import jwt from "jsonwebtoken";
const generateToken = (data: { id: string; instituteNumber?: string }) => {
  //@ts-ignore
  return jwt.sign(data as object, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN as string,
  });
};

export default generateToken;
