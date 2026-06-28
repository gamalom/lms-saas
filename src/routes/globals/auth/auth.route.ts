import express from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
} from "../../../controller/globals/auth/auth.controller";
import asyncErrorHandler from "../../../services/async.error.handling";
import isLoggedIn from "../../../middlewate/middleware";

const router = express.Router();

router.route("/register").post(asyncErrorHandler(registerUser));
router.route("/login").post(asyncErrorHandler(loginUser));
router.route("/me").get(isLoggedIn, asyncErrorHandler(getCurrentUser));

export default router;
