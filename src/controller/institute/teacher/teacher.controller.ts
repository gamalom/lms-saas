import { Request, Response } from "express";
import { QueryTypes } from "sequelize";
import sequelize from "../../../Database/connection";
import User from "../../../Database/models/model.user";
import generatePassword from "../../../services/generateRandomPassword";
import sendMail from "../../../services/send.mail";
import sendSms from "../../../services/send.sms";

interface IExtendedRequest extends Request {
  user?: User;
  instituteNumber?: number;
}

const createTeacher = async (req: IExtendedRequest, res: Response) => {
  const {
    teacherName,
    teacherEmail,
    teacherPhoneNumber,
    teacherExpertise,
    joiningDate,
    salary,
    courseId,
  } = req.body;

  // const teacherImage = req.file ? req.file.filename : null; for local storage
  const teacherImage = req.file ? req.file.path : null; // for cloudinary
  const instituteNumber = req.user?.instituteId;

  if (
    !teacherName ||
    !teacherEmail ||
    !teacherPhoneNumber ||
    !teacherExpertise ||
    !joiningDate ||
    !salary ||
    !courseId
  ) {
    return res.status(400).json({
      message:
        "teacherName, teacherEmail, teacherPhoneNumber, joiningDate, salary, courseId are required",
    });
  }

  if (!instituteNumber) {
    return res.status(400).json({
      message: "Institute number is required",
    });
  }
  // here we have used the generatePassword function to generate a random password for the teacher. in that there are hashed and plain text password.
  const passwordData = generatePassword(teacherName);
  const teacher = await sequelize.query(
    `INSERT INTO teacher_${instituteNumber} (teacherName, teacherEmail, teacherPhoneNumber, teacherExpertise, teacherImage, teacherPassword, joiningDate, salary) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    {
      replacements: [
        teacherName,
        teacherEmail,
        teacherPhoneNumber,
        teacherExpertise,
        teacherImage,
        passwordData.hashVersion,
        joiningDate,
        salary,
      ],
      type: QueryTypes.INSERT,
    },
  );

  const teacherId: { id: string }[] = await sequelize.query(
    `select id from teacher_${instituteNumber} where teacherEmail = ?`,
    {
      replacements: [teacherEmail],
      type: QueryTypes.SELECT,
    },
  );
  console.log(teacherId[0].id, "teacherId");

  await sequelize.query(
    `UPDATE course_${instituteNumber} SET teacherId = ? WHERE courseId = ?`,
    {
      replacements: [teacherId[0].id, courseId],
      type: QueryTypes.UPDATE,
    },
  );
  //send email to the teacher
  await sendMail(
    teacherEmail,
    "Welcome to the platform of the institute",
    `Welcome to the platform of the institute : ${teacherName}, your password is ${passwordData.plainText}, your institute number is ${instituteNumber} and your email is ${teacherEmail}`,
  );

  //send sms to the teacher
  // await sendSms(
  //   `+977${teacherPhoneNumber}`,
  //   `Welcome to the platform of the institute : ${teacherName}, your password is ${passwordData.plainText} and your email is ${teacherEmail} and your phone number is ${teacherPhoneNumber}`,
  // );

  return res.status(200).json({
    message: "Teacher created successfully",
    teacher,
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
      type: QueryTypes.SELECT,
    },
  );
  if (!teacher.length) {
    return res.status(404).json({
      message: "Teacher not found",
    });
  }
  return res.status(200).json({
    message: "Teacher fetched successfully",
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
    `SELECT t.*, c.courseId, c.courseName
     FROM teacher_${instituteNumber} t
     LEFT JOIN course_${instituteNumber} c ON c.teacherId = t.id`,
    {
      type: QueryTypes.SELECT,
    },
  );
  return res.status(200).json({
    message: "Teachers fetched successfully",
    data: teachers,
  });
};

const updateTeacher = async (req: IExtendedRequest, res: Response) => {
  const { teacherId } = req.params;
  const {
    teacherName,
    teacherEmail,
    teacherPhoneNumber,
    teacherExpertise,
    joiningDate,
    salary,
    courseId,
  } = req.body;
  const teacherImage = req.file?.path ?? req.body.teacherImage;
  const instituteNumber = req.user?.instituteId;
  if (!instituteNumber) {
    return res.status(400).json({
      message: "Institute number is required",
    });
  }

  const existingTeacher = await sequelize.query(
    `SELECT * FROM teacher_${instituteNumber} WHERE id = ?`,
    {
      replacements: [teacherId],
      type: QueryTypes.SELECT,
    },
  );
  if (!existingTeacher.length) {
    return res.status(404).json({
      message: "Teacher not found",
    });
  }

  await sequelize.query(
    `UPDATE teacher_${instituteNumber} SET teacherName = ?, teacherEmail = ?, teacherPhoneNumber = ?, teacherExpertise = ?, teacherImage = ?, joiningDate = ?, salary = ? WHERE id = ?`,
    {
      replacements: [
        teacherName,
        teacherEmail,
        teacherPhoneNumber,
        teacherExpertise,
        teacherImage,
        joiningDate,
        salary,
        teacherId,
      ],
      type: QueryTypes.UPDATE,
    },
  );

  if (courseId) {
    const course = await sequelize.query(
      `SELECT courseId FROM course_${instituteNumber} WHERE courseId = ?`,
      {
        replacements: [courseId],
        type: QueryTypes.SELECT,
      },
    );
    if (!course.length) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    await sequelize.query(
      `UPDATE course_${instituteNumber} SET teacherId = NULL WHERE teacherId = ?`,
      {
        replacements: [teacherId],
        type: QueryTypes.UPDATE,
      },
    );

    await sequelize.query(
      `UPDATE course_${instituteNumber} SET teacherId = ? WHERE courseId = ?`,
      {
        replacements: [teacherId, courseId],
        type: QueryTypes.UPDATE,
      },
    );
  }

  return res.status(200).json({
    message: "Teacher updated successfully",
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

  const existingTeacher = await sequelize.query(
    `SELECT * FROM teacher_${instituteNumber} WHERE id = ?`,
    {
      replacements: [teacherId],
      type: QueryTypes.SELECT,
    },
  );
  if (!existingTeacher.length) {
    return res.status(404).json({
      message: "Teacher not found",
    });
  }

  await sequelize.query(`DELETE FROM teacher_${instituteNumber} WHERE id = ?`, {
    replacements: [teacherId],
    type: QueryTypes.DELETE,
  });

  return res.status(200).json({
    message: "Teacher deleted successfully",
  });
};

export {
  createTeacher,
  deleteTeacher,
  getAllTeachers,
  getSingleTeacher,
  updateTeacher,
};
