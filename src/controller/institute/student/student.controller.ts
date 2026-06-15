import { Request, Response } from "express";
import { QueryTypes } from "sequelize";
import sequelize from "../../../Database/connection";
import User from "../../../Database/models/model.user";

interface IExtendedRequest extends Request {
  user?: User;
  instituteNumber?: number;
}

const createStudent = async (req: IExtendedRequest, res: Response) => {
  const {
    studentName,
    studentEmail,
    studentPhoneNumber,
    studentAddress,
    enrollmentDate,
  } = req.body;
  const studentImage = req.file?.filename;
  const instituteNumber = req.user?.instituteId;
  if (
    !studentName ||
    !studentEmail ||
    !studentPhoneNumber ||
    !studentAddress ||
    !enrollmentDate ||
    !studentImage
  ) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  if (!instituteNumber) {
    return res.status(400).json({
      message: "Institute number is required",
    });
  }
  const student = await sequelize.query(
    `INSERT INTO student_${instituteNumber} (studentName, studentEmail, studentPhoneNumber, studentAddress, enrollmentDate, studentImage) VALUES (?, ?, ?, ?, ?, ?)`,
    {
      replacements: [
        studentName,
        studentEmail,
        studentPhoneNumber,
        studentAddress,
        enrollmentDate,
        studentImage,
      ],
      type: QueryTypes.INSERT,
    },
  );
  return res.status(200).json({
    message: "Student created successfully",
    student,
  });
};

const deleteStudent = async (req: IExtendedRequest, res: Response) => {
  const { studentId } = req.params;
  const instituteNumber = req.user?.instituteId;
  if (!instituteNumber) {
    return res.status(400).json({
      message: "Institute number is required",
    });
  }
  const student = await sequelize.query(
    `SELECT * FROM student_${instituteNumber} WHERE id = ?`,
    {
      replacements: [studentId],
      type: QueryTypes.SELECT,
    },
  );
  if (!student) {
    return res.status(404).json({
      message: "Student not found",
    });
  }
  await sequelize.query(`DELETE FROM student_${instituteNumber} WHERE id = ?`, {
    replacements: [studentId],
    type: QueryTypes.DELETE,
  });
  return res.status(200).json({
    message: "Student deleted successfully",
  });
};

const getAllStudents = async (req: IExtendedRequest, res: Response) => {
  const instituteNumber = req.user?.instituteId;
  if (!instituteNumber) {
    return res.status(400).json({
      message: "Institute number is required",
    });
  }
  const students = await sequelize.query(
    `SELECT * FROM student_${instituteNumber}`,
    { type: QueryTypes.SELECT },
  );
  return res.status(200).json({
    message: "Students fetched successfully",
    data: students,
  });
};

const getSingleStudent = async (req: IExtendedRequest, res: Response) => {
  const { studentId } = req.params;
  const instituteNumber = req.user?.instituteId;
  if (!instituteNumber) {
    return res.status(400).json({
      message: "Institute number is required",
    });
  }
  const student = await sequelize.query(
    `SELECT * FROM student_${instituteNumber} WHERE id = ?`,
    {
      replacements: [studentId],
      type: QueryTypes.SELECT,
    },
  );
  if (!student) {
    return res.status(404).json({
      message: "Student not found",
    });
  }
  return res.status(200).json({
    message: "Student fetched successfully",
    data: student,
  });
};

const updateStudent = async (req: IExtendedRequest, res: Response) => {
  const { studentId } = req.params;
  const {
    studentName,
    studentEmail,
    studentPhoneNumber,
    studentAddress,
    enrollmentDate,
  } = req.body;
  const studentImage = req.file?.filename ?? req.body.studentImage;
  const instituteNumber = req.user?.instituteId;

  if (!instituteNumber) {
    return res.status(400).json({
      message: "Institute number is required",
    });
  }

  const student = await sequelize.query(
    `UPDATE student_${instituteNumber} SET studentName = ?, studentEmail = ?, studentPhoneNumber = ?, studentAddress = ?, enrollmentDate = ?, studentImage = ? WHERE id = ?`,
    {
      replacements: [
        studentName,
        studentEmail,
        studentPhoneNumber,
        studentAddress,
        enrollmentDate,
        studentImage,
        studentId,
      ],
      type: QueryTypes.UPDATE,
    },
  );
  if (!student) {
    return res.status(404).json({
      message: "Student not found",
    });
  }
  return res.status(200).json({
    message: "Student updated successfully",
    data: student,
  });
};

export {
  createStudent,
  deleteStudent,
  getAllStudents,
  getSingleStudent,
  updateStudent,
};
