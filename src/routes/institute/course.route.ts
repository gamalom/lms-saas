import express from "express";
import asyncErrorHandler from "../../services/async.error.handling";
import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
} from "../../controller/institute/course/course.controller";

const router = express.Router();
router.route("/course").post(asyncErrorHandler(createCourse));
router.route("/course/:courseId").delete(asyncErrorHandler(deleteCourse));
router.route("/course/:courseId").get(asyncErrorHandler(getSingleCourse));
router.route("/course").get(asyncErrorHandler(getAllCourses));
router.route("/course/:courseId").put(asyncErrorHandler(updateCourse));

export default router;
