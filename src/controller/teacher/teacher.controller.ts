import { Request, Response } from "express";
import bcrypt from "bcrypt";
import sequelize from "../../Database/connection";
import { QueryTypes } from "sequelize";
import jwt from "jsonwebtoken";
import generateToken from "../../services/generate.token";

const teacherLogin = async (req: Request, res: Response) => {
  const { teacherEmail, teacherPassword, instituteNumber } = req.body;
  if (!teacherEmail || !teacherPassword || !instituteNumber) {
    return res.status(400).json({
      message: "teacherEmail, teacherPassword and instituteNumber are required",
    });
  }
  const teacher: { id: string; teacherPassword: string }[] =
    await sequelize.query(
      `SELECT * FROM teacher_${instituteNumber} WHERE teacherEmail = ? `,
      {
        replacements: [teacherEmail],
        type: QueryTypes.SELECT,
      },
    );
  if (!teacher.length) {
    return res.status(404).json({
      message: "Teacher not found",
    });
  }
  //check if the password is valid
  const isPasswordValid = bcrypt.compareSync(
    teacherPassword,
    teacher[0].teacherPassword,
  );
  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Invalid password",
    });
  }
  //generate a token
  const token = generateToken({
    id: teacher[0].id as string,
    instituteNumber: instituteNumber,
  });
  return res.status(200).json({
    message: "Login successful",
    token,
  });
};

export default teacherLogin;
