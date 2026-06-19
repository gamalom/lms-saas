import express from "express";
import teacherLogin from "../../controller/teacher/teacher.controller";
import asyncErrorHandler from "../../services/async.error.handling";

const router = express.Router();

router.route("/teacher").post(asyncErrorHandler(teacherLogin));

export default router;
