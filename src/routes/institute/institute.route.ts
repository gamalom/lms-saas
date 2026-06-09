import express from "express";
import { createInstitute } from "../../controller/institute/institute.controller";

const router = express.Router();

router.route("/institute").post(createInstitute);

export default router;
