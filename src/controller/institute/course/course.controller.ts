import { Request, Response } from "express";
import { QueryTypes } from "sequelize";
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
    categoryId,
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
    !courseDescription ||
    !categoryId
  ) {
    return res.status(400).json({
      message:
        "courseName, courseThumbnail, courseDuration, coursePrice, courseLevel, courseDescription, categoryId are required",
    });
  }

  if (!instituteNumber) {
    return res.status(400).json({
      message: "Institute number is required",
    });
  }

  const category = await sequelize.query(
    `SELECT id FROM catagory_${instituteNumber} WHERE id = ?`,
    {
      replacements: [categoryId],
      type: QueryTypes.SELECT,
    },
  );

  if (!category.length) {
    return res.status(404).json({
      message: "Category not found",
    });
  }

  const course = await sequelize.query(
    `INSERT INTO course_${instituteNumber} (courseName, courseThumbnail, courseDuration, coursePrice, courseLevel, courseDescription, categoryId) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    {
      replacements: [
        courseName,
        courseThumbnail,
        courseDuration,
        coursePrice,
        courseLevel,
        courseDescription,
        categoryId,
      ],
      type: QueryTypes.INSERT,
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
    `SELECT * FROM course_${instituteNumber} WHERE courseId = ?`,
    {
      replacements: [courseId],
      type: QueryTypes.SELECT,
    },
  );
  if (!course) {
    return res.status(404).json({
      message: "Course not found",
    });
  }
  const deletedCourse = await sequelize.query(
    `DELETE FROM course_${instituteNumber} WHERE courseId = ?`,
    {
      replacements: [courseId],
      type: QueryTypes.DELETE,
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
    `SELECT * FROM course_${instituteNumber} JOIN catagory_${instituteNumber} ON course_${instituteNumber}.categoryId = catagory_${instituteNumber}.id`,
    { type: QueryTypes.SELECT },
  );
  return res.status(200).json({
    message: "Courses fetched successfully",
    data: courses,
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
    categoryId,
  } = req.body;
  const courseThumbnail = req.file?.filename ?? req.body.courseThumbnail;
  const instituteNumber = req.user?.instituteId;
  if (!instituteNumber) {
    return res.status(400).json({
      message: "Institute number is required",
    });
  }
  const course = await sequelize.query(
    `UPDATE course_${instituteNumber} SET courseName = ?, courseThumbnail = ?, courseDuration = ?, coursePrice = ?, courseLevel = ?, courseDescription = ?, categoryId = ? WHERE courseId = ?`,
    {
      replacements: [
        courseName,
        courseThumbnail,
        courseDuration,
        coursePrice,
        courseLevel,
        courseDescription,
        categoryId,
        courseId,
      ],
      type: QueryTypes.UPDATE,
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

export { createCourse, deleteCourse, getAllCourses, updateCourse };
