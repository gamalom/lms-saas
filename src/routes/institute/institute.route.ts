import express from "express";
import { createInstitute } from "../../controller/institute/institute.controller";
import isLoggedIn from "../../middlewate/middleware";
const router = express.Router();

router.route("/institute").post(isLoggedIn, createInstitute);

export default router;
