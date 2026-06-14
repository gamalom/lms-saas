import { Request, Response } from "express";
import User from "../../../Database/models/model.user";
import sequelize from "../../../Database/connection";

interface IExtendedRequest extends Request {
  user?: User;
  instituteNumber?: number;
}

const createCategory = async (req: IExtendedRequest, res: Response) => {
  const { categoryName, categoryDescription } = req.body;
  const instituteNumber = req.user?.instituteId;
  if (!instituteNumber) {
    return res.status(400).json({
      message: "Institute number is required",
    });
  }
  if (!categoryName || !categoryDescription) {
    return res.status(400).json({
      message: "Category name and description are required",
    });
  }
  const category = await sequelize.query(
    `INSERT INTO category_${instituteNumber} (categoryName, categoryDescription) VALUES (?, ?)`,
    {
      replacements: [categoryName, categoryDescription],
    },
  );
  return res.status(200).json({
    message: "Category created successfully",
    data: category,
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
    `SELECT * FROM category_${instituteNumber}`,
  );
  return res.status(200).json({
    message: "Categories fetched successfully",
    data: categories,
  });
};

const getCategoryById = async (req: IExtendedRequest, res: Response) => {
  const { categoryId } = req.params;
  const instituteNumber = req.user?.instituteId;
  if (!instituteNumber) {
    return res.status(400).json({
      message: "Institute number is required",
    });
  }
  const category = await sequelize.query(
    `SELECT * FROM category_${instituteNumber} WHERE id = ?`,
    {
      replacements: [categoryId],
    },
  );
  return res.status(200).json({
    message: "Category fetched successfully",
    data: category,
  });
};


const updateCategory = async (req: IExtendedRequest, res: Response) => {
  const { categoryId } = req.params;
  const { categoryName, categoryDescription } = req.body;
  const instituteNumber = req.user?.instituteId;
  if (!instituteNumber) {
    return res.status(400).json({
      message: "Institute number is required",
    });
  }
  const category = await sequelize.query(
    `UPDATE category_${instituteNumber} SET categoryName = ?, categoryDescription = ? WHERE id = ?`,
    {
      replacements: [categoryName, categoryDescription, categoryId],
    },
  );
  return res.status(200).json({
    message: "Category updated successfully",
    data: category,
  }
};

const deleteCategory = async (req: IExtendedRequest, res: Response) => {
  const { categoryId } = req.params;
  const instituteNumber = req.user?.instituteId;
  if (!instituteNumber) {
    return res.status(400).json({
      message: "Institute number is required",
    });
  }
  const category = await sequelize.query(
    `DELETE FROM category_${instituteNumber} WHERE id = ?`,
    {
      replacements: [categoryId],
    },
  );
  return res.status(200).json({
    message: "Category deleted successfully",
  });

};



export { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory };
