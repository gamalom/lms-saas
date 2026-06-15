import express from "express";
import asyncErrorHandler from "../../services/async.error.handling";
import {
  createCourse,
  deleteCourse,
  getAllCourses,
  updateCourse,
} from "../../controller/institute/course/course.controller";

import isLoggedIn from "../../middlewate/middleware";
// import { multer, storage } from "../../middlewate/middleware.multer";
// const upload = multer({ storage: storage });

import multer from "multer";
import { upload } from "../../services/multerUpload";

const router = express.Router();
router
  .route("/course")
  .post(
    isLoggedIn,
    upload.single("courseThumbnail"),
    asyncErrorHandler(createCourse),
  );
router
  .route("/course/:courseId")
  .delete(isLoggedIn, asyncErrorHandler(deleteCourse));

router.route("/course").get(isLoggedIn, asyncErrorHandler(getAllCourses));
router
  .route("/course/:courseId")
  .put(
    isLoggedIn,
    upload.single("courseThumbnail"),
    asyncErrorHandler(updateCourse),
  );

export default router;
