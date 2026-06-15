import express from "express";
import {
  getAllCategories,
  getSingleCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../controller/institute/category/category.contoller";
import isLoggedIn from "../../middlewate/middleware";
import asyncErrorHandler from "../../services/async.error.handling";
const router = express.Router();
router.route("/category").get(isLoggedIn, asyncErrorHandler(getAllCategories));
router
  .route("/category/:categoryId")
  .get(isLoggedIn, asyncErrorHandler(getSingleCategory));
router.route("/category").post(isLoggedIn, asyncErrorHandler(createCategory));
router
  .route("/category/:categoryId")
  .put(isLoggedIn, asyncErrorHandler(updateCategory));
router
  .route("/category/:categoryId")
  .delete(isLoggedIn, asyncErrorHandler(deleteCategory));

export default router;
