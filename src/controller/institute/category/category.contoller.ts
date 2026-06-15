import { Request, Response } from "express";
import { QueryTypes } from "sequelize";
import sequelize from "../../../Database/connection";
import User from "../../../Database/models/model.user";

interface IExtendedRequest extends Request {
  user?: User;
  instituteNumber?: number;
}

const createCategory = async (req: IExtendedRequest, res: Response) => {
  const { catagoryName, catagoryDescription } = req.body;
  const instituteNumber = req.user?.instituteId;

  if (!catagoryName || !catagoryDescription) {
    return res.status(400).json({
      message: "catagoryName and catagoryDescription are required",
    });
  }

  if (!instituteNumber) {
    return res.status(400).json({
      message: "Institute number is required",
    });
  }

  const category = await sequelize.query(
    `INSERT INTO catagory_${instituteNumber} (catagoryName, catagoryDescription) VALUES (?, ?)`,
    {
      replacements: [catagoryName, catagoryDescription],
      type: QueryTypes.INSERT,
    },
  );

  return res.status(200).json({
    message: "Category created successfully",
  });
};

const deleteCategory = async (req: IExtendedRequest, res: Response) => {
  const { categoryId } = req.params;
  const instituteNumber = req.user?.instituteId;

  if (!instituteNumber) {
    return res.status(400).json({
      message: "Institute number is required",
    });
  }

  await sequelize.query(
    `DELETE FROM catagory_${instituteNumber} WHERE id = ?`,
    {
      replacements: [categoryId],
      type: QueryTypes.DELETE,
    },
  );
  return res.status(200).json({
    message: "Category deleted successfully",
  });
};

const getAllCategories = async (req: IExtendedRequest, res: Response) => {
  const instituteNumber = req.user?.instituteId;

  if (!instituteNumber) {
    return res.status(400).json({
      message: "Institute number is required",
    });
  }

  const categories = await sequelize.query(
    `SELECT * FROM catagory_${instituteNumber}`,
    { type: QueryTypes.SELECT },
  );

  return res.status(200).json({
    message: "Categories fetched successfully",
    data: categories,
  });
};

const getSingleCategory = async (req: IExtendedRequest, res: Response) => {
  const { categoryId } = req.params;
  const instituteNumber = req.user?.instituteId;

  if (!instituteNumber) {
    return res.status(400).json({
      message: "Institute number is required",
    });
  }

  const category = await sequelize.query(
    `SELECT * FROM catagory_${instituteNumber} WHERE id = ?`,
    {
      replacements: [categoryId],
      type: QueryTypes.SELECT,
    },
  );

  if (!category) {
    return res.status(404).json({
      message: "Category not found",
    });
  }

  return res.status(200).json({
    message: "Category fetched successfully",
    data: category,
  });
};

const updateCategory = async (req: IExtendedRequest, res: Response) => {
  const { categoryId } = req.params;
  const { catagoryName, catagoryDescription } = req.body;
  const instituteNumber = req.user?.instituteId;

  if (!instituteNumber) {
    return res.status(400).json({
      message: "Institute number is required",
    });
  }

  const category = await sequelize.query(
    `UPDATE catagory_${instituteNumber} SET catagoryName = ?, catagoryDescription = ? WHERE id = ?`,
    {
      replacements: [catagoryName, catagoryDescription, categoryId],
      type: QueryTypes.UPDATE,
    },
  );

  if (!category) {
    return res.status(404).json({
      message: "Category not found",
    });
  }

  return res.status(200).json({
    message: "Category updated successfully",
    data: category,
  });
};

export {
  createCategory,
  deleteCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
};
