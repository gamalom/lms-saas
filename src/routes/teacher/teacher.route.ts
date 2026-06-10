import asyncErrorHandler from "../../services/async.error.handling";
import {
  createTeacher,
  deleteTeacher,
  getAllTeachers,
  getSingleTeacher,
  updateTeacher,
} from "../../controller/institute/teacher/teacher.controller";
import express from "express";
const router = express.Router();

router.route("/teacher").post(asyncErrorHandler(createTeacher));
router.route("/teacher/:teacherId").delete(asyncErrorHandler(deleteTeacher));
router.route("/teacher/:teacherId").get(asyncErrorHandler(getSingleTeacher));
router.route("/teacher").get(asyncErrorHandler(getAllTeachers));
router.route("/teacher/:teacherId").put(asyncErrorHandler(updateTeacher));

export default router;
