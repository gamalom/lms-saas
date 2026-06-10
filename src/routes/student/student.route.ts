import {
  createStudent,
  deleteStudent,
  getAllStudents,
  getSingleStudent,
  updateStudent,
} from "../../controller/institute/student/student.controller";
import asyncErrorHandler from "../../services/async.error.handling";
import express from "express";

const router = express.Router();

router.route("/student").post(asyncErrorHandler(createStudent));
router.route("/student/:studentId").delete(asyncErrorHandler(deleteStudent));
router.route("/student/:studentId").get(asyncErrorHandler(getSingleStudent));
router.route("/student").get(asyncErrorHandler(getAllStudents));
router.route("/student/:studentId").put(asyncErrorHandler(updateStudent));

export default router;
