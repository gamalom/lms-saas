import { Request, Response } from "express";
import sequelize from "../../../Database/connection";
import User from "../../../Database/models/model.user";

interface IExtendedRequest extends Request {
  user?: User;
  instituteNumber?: number;
}

const createCourse = async (req: IExtendedRequest, res: Response) => {
  const {
    courseName,
    courseDuration,
    coursePrice,
    courseLevel,
    courseDescription,
  } = req.body;

  // const courseThumbnail = req.file ? req.file.filename : null; for local storage
  const courseThumbnail = req.file ? req.file.path : null; // for cloudinary
  const instituteNumber = req.user?.instituteId;

  if (
    !courseName ||
    !courseThumbnail ||
    !courseDuration ||
    !coursePrice ||
    !courseLevel ||
    !courseDescription
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

  const course = await sequelize.query(
    `INSERT INTO course_${instituteNumber} (courseName, courseThumbnail, courseDuration, coursePrice, courseLevel, courseDescription) VALUES (?, ?, ?, ?, ?, ?)`,
    {
      replacements: [
        courseName,
        courseThumbnail,
        courseDuration,
        coursePrice,
        courseLevel,
        courseDescription,
      ],
    },
  );

  return res.status(200).json({
    message: "Course created successfully",
    course,
  });
};

const deleteCourse = async (req: IExtendedRequest, res: Response) => {
  const { courseId } = req.params;
  const instituteNumber = req.user?.instituteId;
  if (!instituteNumber) {
    return res.status(400).json({
      message: "Institute number is required",
    });
  }
  //check if the course exists or not of that id
  const course = await sequelize.query(
    `SELECT * FROM course_${instituteNumber} WHERE id = ?`,
    {
      replacements: [courseId],
    },
  );
  if (!course) {
    return res.status(404).json({
      message: "Course not found",
    });
  }
  const deletedCourse = await sequelize.query(
    `DELETE FROM course_${instituteNumber} WHERE id = ?`,
    {
      replacements: [courseId],
    },
  );
  return res.status(200).json({
    message: "Course deleted successfully",
  });
};

const getAllCourses = async (req: IExtendedRequest, res: Response) => {
  const instituteNumber = req.user?.instituteId;
  if (!instituteNumber) {
    return res.status(400).json({
      message: "Institute number is required",
    });
  }
  const courses = await sequelize.query(
    `SELECT * FROM course_${instituteNumber}`,
  );
  return res.status(200).json({
    message: "Courses fetched successfully",
    data: courses,
  });
};

const getSingleCourse = async (req: IExtendedRequest, res: Response) => {
  const { courseId } = req.params;
  const instituteNumber = req.user?.instituteId;
  if (!instituteNumber) {
    return res.status(400).json({
      message: "Institute number is required",
    });
  }
  const course = await sequelize.query(
    `SELECT * FROM course_${instituteNumber} WHERE id = ?`,
    {
      replacements: [courseId],
    },
  );
  if (!course) {
    return res.status(404).json({
      message: "Course not found",
    });
  }
  return res.status(200).json({
    message: "Course fetched successfully",
    data: course,
  });
};

const updateCourse = async (req: IExtendedRequest, res: Response) => {
  const { courseId } = req.params;
  const {
    courseName,
    courseDuration,
    coursePrice,
    courseLevel,
    courseDescription,
  } = req.body;
  const courseThumbnail = req.file?.filename ?? req.body.courseThumbnail;
  const instituteNumber = req.user?.instituteId;
  if (!instituteNumber) {
    return res.status(400).json({
      message: "Institute number is required",
    });
  }
  const course = await sequelize.query(
    `UPDATE course_${instituteNumber} SET courseName = ?, courseThumbnail = ?, courseDuration = ?, coursePrice = ?, courseLevel = ?, courseDescription = ? WHERE id = ?`,
    {
      replacements: [
        courseName,
        courseThumbnail,
        courseDuration,
        coursePrice,
        courseLevel,
        courseDescription,
        courseId,
      ],
    },
  );
  if (!course) {
    return res.status(404).json({
      message: "Course not found",
    });
  }
  return res.status(200).json({
    message: "Course updated successfully",
    data: course,
  });
};

export {
  createCourse,
  deleteCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
};
