import { Request, Response } from "express";
import sequelize from "../../../Database/connection";
interface IExtendedRequest extends Request {
  instituteNumber?: number;
}

const createTeacher = async (req: IExtendedRequest, res: Response) => {
  const {
    teacherName,
    teacherEmail,
    teacherPhoneNumber,
    teacherAddress,
    teacherImage,
  } = req.body;
  const instituteNumber = req.user?.instituteId;
  if (
    !teacherName ||
    !teacherEmail ||
    !teacherPhoneNumber ||
    !teacherAddress ||
    !teacherImage
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
  const teacher = await sequelize.query(
    `INSERT INTO teacher_${instituteNumber} (teacherName, teacherEmail, teacherPhoneNumber, teacherAddress, teacherImage) VALUES (?, ?, ?, ?, ?)`,
    {
      replacements: [
        teacherName,
        teacherEmail,
        teacherPhoneNumber,
        teacherAddress,
        teacherImage,
      ],
    },
  );
  return res.status(200).json({
    message: "Teacher created successfully",
    data: teacher,
  });
};

const deleteTeacher = async (req: IExtendedRequest, res: Response) => {
  const { teacherId } = req.params;
  const instituteNumber = req.user?.instituteId;
  if (!instituteNumber) {
    return res.status(400).json({
      message: "Institute number is required",
    });
  }
  const teacher = await sequelize.query(
    `DELETE FROM teacher_${instituteNumber} WHERE id = ?`,
    {
      replacements: [teacherId],
    },
  );
  return res.status(200).json({
    message: "Teacher deleted successfully",
    data: teacher,
  });
};

const getSingleTeacher = async (req: IExtendedRequest, res: Response) => {
  const { teacherId } = req.params;
  const instituteNumber = req.user?.instituteId;
  if (!instituteNumber) {
    return res.status(400).json({
      message: "Institute number is required",
    });
  }
  const teacher = await sequelize.query(
    `SELECT * FROM teacher_${instituteNumber} WHERE id = ?`,
    {
      replacements: [teacherId],
    },
  );
  return res.status(200).json({
    message: "Teacher fetched successfully",
    data: teacher,
  });
};

const updateTeacher = async (req: IExtendedRequest, res: Response) => {
  const { teacherId } = req.params;
  const {
    teacherName,
    teacherEmail,
    teacherPhoneNumber,
    teacherAddress,
    teacherImage,
  } = req.body;
  const instituteNumber = req.user?.instituteId;
  if (!instituteNumber) {
    return res.status(400).json({
      message: "Institute number is required",
    });
  }
  const teacher = await sequelize.query(
    `UPDATE teacher_${instituteNumber} SET teacherName = ?, teacherEmail = ?, teacherPhoneNumber = ?, teacherAddress = ?, teacherImage = ? WHERE id = ?`,
    {
      replacements: [
        teacherName,
        teacherEmail,
        teacherPhoneNumber,
        teacherAddress,
        teacherImage,
        teacherId,
      ],
    },
  );
  return res.status(200).json({
    message: "Teacher updated successfully",
    data: teacher,
  });
};

const getAllTeachers = async (req: IExtendedRequest, res: Response) => {
  const instituteNumber = req.user?.instituteId;
  if (!instituteNumber) {
    return res.status(400).json({
      message: "Institute number is required",
    });
  }
  const teachers = await sequelize.query(
    `SELECT * FROM teacher_${instituteNumber}`,
  );
  return res.status(200).json({
    message: "Teachers fetched successfully",
    data: teachers,
  });
};
export {
  createTeacher,
  deleteTeacher,
  getAllTeachers,
  getSingleTeacher,
  updateTeacher,
};
