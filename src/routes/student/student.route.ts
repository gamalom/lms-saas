import {
  createStudent,
  deleteStudent,
  getAllStudents,
  getSingleStudent,
  updateStudent,
} from "../../controller/institute/student/student.controller";
import asyncErrorHandler from "../../services/async.error.handling";
import express from "express";
import isLoggedIn from "../../middlewate/middleware";
// import { multer, storage } from "../../middlewate/middleware.multer";
// const upload = multer({ storage: storage });

import multer from "multer";
import { storage, uploadLimits } from "../../services/cloudinary";
const upload = multer({ storage: storage, limits: uploadLimits });

const router = express.Router();

router
  .route("/student")
  .post(
    isLoggedIn,
    upload.single("studentImage"),
    asyncErrorHandler(createStudent),
  );
router
  .route("/student/:studentId")
  .delete(isLoggedIn, asyncErrorHandler(deleteStudent));
router
  .route("/student/:studentId")
  .get(isLoggedIn, asyncErrorHandler(getSingleStudent));
router.route("/student").get(isLoggedIn, asyncErrorHandler(getAllStudents));
router
  .route("/student/:studentId")
  .put(
    isLoggedIn,
    upload.single("studentImage"),
    asyncErrorHandler(updateStudent),
  );

export default router;
