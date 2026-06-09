import { Request, Response } from "express";
import sequelize from "../../Database/connection";

const createInstitute = async (req: Request, res: Response) => {
  const {
    instituteName,
    instituteAddress,
    institutePhoneNumber,
    instituteEmail,
  } = req.body;
  const instituteVatNumber = req.body.instituteVatNumber || null;
  const institutePanNumber = req.body.institutePanNumber || null;

  if (
    !instituteName ||
    !instituteAddress ||
    !institutePhoneNumber ||
    !instituteEmail
  ) {
    return res.status(400).json({
      message:
        "instituteName, instituteAddress, institutePhoneNumber, instituteEmail fields are required",
    });
  }

  const instituteNumber = Math.floor(100000 + Math.random() * 900000);
  const tableName = `institute_${instituteNumber}`;

  try {
    await sequelize.query(
      `CREATE TABLE IF NOT EXISTS ${tableName}(
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        instituteName VARCHAR(255) NOT NULL,
        instituteAddress VARCHAR(255) NOT NULL,
        institutePhoneNumber VARCHAR(255) NOT NULL UNIQUE,
        instituteEmail VARCHAR(255) NOT NULL UNIQUE,
        instituteVatNumber VARCHAR(255),
        institutePanNumber VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
    );

    await sequelize.query(
      `INSERT INTO ${tableName} (instituteName, instituteAddress, institutePhoneNumber, instituteEmail, instituteVatNumber, institutePanNumber) VALUES (?, ?, ?, ?, ?, ?)`,
      {
        replacements: [
          instituteName,
          instituteAddress,
          institutePhoneNumber,
          instituteEmail,
          instituteVatNumber,
          institutePanNumber,
        ],
      },
    );

    return res.status(200).json({
      message: "Institute created successfully",
      instituteNumber,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to create institute",
    });
  }
};

export { createInstitute };
