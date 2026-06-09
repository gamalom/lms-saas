import express from "express";
import { registerUser } from "../../../controller/globals/auth/auth.contoller";

const router = express.Router();

router.route("/register").post(registerUser);

export default router;
