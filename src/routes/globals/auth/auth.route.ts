import express from "express";
import {
  registerUser,
  loginUser,
} from "../../../controller/globals/auth/auth.controller";
import asyncErrorHandler from "../../../services/async.error.handling";

const router = express.Router();

router.route("/register").post(asyncErrorHandler(registerUser));
router.route("/login").post(asyncErrorHandler(loginUser));

export default router;
