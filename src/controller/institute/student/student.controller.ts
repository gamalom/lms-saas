import { Request, Response } from "express";
import sequelize from "../../../Database/connection";

interface IExtendedRequest extends Request {
  instituteNumber?: number;
}

const createStudent = async (req: IExtendedRequest, res: Response) => {
  const {
    studentName,
    studentEmail,
    studentPhoneNumber,
    studentAddress,
    enrollmentDate,
    studentImage,
  } = req.body;
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
  const student = await sequelize.query(
    `DELETE FROM student_${instituteNumber} WHERE id = ?`,
    {
      replacements: [studentId],
    },
  );
  if (!student) {
    return res.status(404).json({
      message: "Student not found",
    });
  }
  return res.status(200).json({
    message: "Student deleted successfully",
  });
};

const getAllStudents = async (req: IExtendedRequest, res: Response) => {
  const instituteNumber = req.user?.instituteId;
  const students = await sequelize.query(
    `SELECT * FROM student_${instituteNumber}`,
  );
  return res.status(200).json({
    message: "Students fetched successfully",
    data: students,
  });
};

const getSingleStudent = async (req: IExtendedRequest, res: Response) => {
  const { studentId } = req.params;
  const instituteNumber = req.user?.instituteId;
  const student = await sequelize.query(
    `SELECT * FROM student_${instituteNumber} WHERE id = ?`,
    {
      replacements: [studentId],
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
  const { studentName, studentEmail, studentPhoneNumber, studentAddress } =
    req.body;
  const instituteNumber = req.user?.instituteId;
  const student = await sequelize.query(
    `UPDATE student_${instituteNumber} SET studentName = ?, studentEmail = ?, studentPhoneNumber = ?, studentAddress = ? WHERE id = ?`,
    {
      replacements: [
        studentName,
        studentEmail,
        studentPhoneNumber,
        studentAddress,
        studentId,
      ],
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
