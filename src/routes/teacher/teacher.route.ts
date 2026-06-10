import asyncErrorHandler from "../../services/async.error.handling";
import {
  createTeacher,
  deleteTeacher,
  getAllTeachers,
  getSingleTeacher,
  updateTeacher,
} from "../../controller/institute/teacher/teacher.controller";
import express from "express";
import isLoggedIn from "../../middlewate/middleware";
// import { multer, storage } from "../../middlewate/middleware.multer";
// const upload = multer({ storage: storage });

import multer from "multer";
import { cloudinary, storage } from "../../services/cloudinary";
const upload = multer({ storage: storage });

const router = express.Router();

router
  .route("/teacher")
  .post(
    isLoggedIn,
    upload.single("teacherImage"),
    asyncErrorHandler(createTeacher),
  );
router
  .route("/teacher/:teacherId")
  .delete(isLoggedIn, asyncErrorHandler(deleteTeacher));
router
  .route("/teacher/:teacherId")
  .get(isLoggedIn, asyncErrorHandler(getSingleTeacher));
router.route("/teacher").get(isLoggedIn, asyncErrorHandler(getAllTeachers));
router
  .route("/teacher/:teacherId")
  .put(
    isLoggedIn,
    upload.single("teacherImage"),
    asyncErrorHandler(updateTeacher),
  );

export default router;
