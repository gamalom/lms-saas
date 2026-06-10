import express from "express";
import {
  createInstitute,
  createTeacherTable,
  createStudentTable,
  createCourseTable,
} from "../../controller/institute/institute.controller";

import isLoggedIn from "../../middlewate/middleware";
import asyncErrorHandler from "../../services/async.error.handling";

const router = express.Router();

router
  .route("/institute")
  .post(
    isLoggedIn,
    asyncErrorHandler(createInstitute),
    asyncErrorHandler(createTeacherTable),
    asyncErrorHandler(createStudentTable),
    asyncErrorHandler(createCourseTable),
  );

export default router;
