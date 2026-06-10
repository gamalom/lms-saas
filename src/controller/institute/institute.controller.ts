import { NextFunction, Request, Response } from "express";
import sequelize from "../../Database/connection";
import User from "../../Database/models/model.user";

interface IExtendedRequest extends Request {
  user?: User;
  instituteNumber?: number;
}

const createInstitute = async (
  req: IExtendedRequest,
  res: Response,
  next: NextFunction,
) => {
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
  console.log("Institute table created successfully");
  //create a new table for the institute for the user to know the history of the institute created by him
  await sequelize.query(
    `CREATE TABLE IF NOT EXISTS user_institute(
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        userId VARCHAR(255) REFERENCES users(id),
        instituteId INT NOT NULL UNIQUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
  );
  //insert the user id and the institute number into the user_institute table
  if (req.user) {
    await sequelize.query(
      `INSERT INTO user_institute (userId, instituteId) VALUES (?, ?)`,
      {
        replacements: [req.user.id, instituteNumber],
      },
    );
  }

  //update user role to institute and set instituteId to the instituteNumber
  if (req.user) {
    await User.update(
      { instituteId: instituteNumber, role: "institute" },
      {
        where: {
          id: req.user.id,
        },
      },
    );
    console.log("User updated");
  }

  req.instituteNumber = instituteNumber;
  next();
};

const createTeacherTable = async (
  req: IExtendedRequest,
  res: Response,
  next: NextFunction,
) => {
  const instituteNumber = req.instituteNumber;

  if (!instituteNumber) {
    return res.status(500).json({
      message: "Institute number missing — teacher table was not created",
    });
  }

  await sequelize.query(
    `CREATE TABLE IF NOT EXISTS teacher_${instituteNumber}(
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        teacherName VARCHAR(255) NOT NULL,
        teacherEmail VARCHAR(255) NOT NULL UNIQUE,
        teacherPhoneNumber VARCHAR(255) NOT NULL UNIQUE,
        teacherExpertise VARCHAR(255),
        joiningDate DATE,
        salary VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
  );
  req.instituteNumber = instituteNumber;
  console.log("Teacher table created successfully");
  next();
};

const createStudentTable = async (
  req: IExtendedRequest,
  res: Response,
  next: NextFunction,
) => {
  const instituteNumber = req.instituteNumber;
  if (!instituteNumber) {
    return res.status(500).json({
      message: "Institute number missing — student table was not created",
    });
  }

  await sequelize.query(
    `CREATE TABLE IF NOT EXISTS student_${instituteNumber}(
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        studentName VARCHAR(255) NOT NULL,
        studentEmail VARCHAR(255) NOT NULL UNIQUE,
        studentPhoneNumber VARCHAR(255) NOT NULL UNIQUE,
        studentAddress VARCHAR(255) NOT NULL,
        enrollmentDate DATE,
        studentImage VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
  );

  console.log("Student table created successfully");
  next();
};

const catagoryTable = async (
  req: IExtendedRequest,
  res: Response,
  next: NextFunction,
) => {
  const instituteNumber = req.user?.instituteId;
  await sequelize.query(
    `CREATE TABLE IF NOT EXISTS catagory_${instituteNumber}(
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        catagoryName VARCHAR(255) NOT NULL,
        catagoryDescription TEXT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
  );
  console.log("Catagory table created successfully");
  next();
};

const createCourseTable = async (
  req: IExtendedRequest,
  res: Response,
  next: NextFunction,
) => {
  const instituteNumber = req.instituteNumber;
  if (!instituteNumber) {
    return res.status(500).json({
      message: "Institute number missing — course table was not created",
    });
  }

  await sequelize.query(
    `CREATE TABLE IF NOT EXISTS course_${instituteNumber}(
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        courseName VARCHAR(255) NOT NULL, 
        courseThumbnail VARCHAR(255),
        courseDuration VARCHAR(255) NOT NULL,
        courseDescription TEXT NOT NULL,
        coursePrice VARCHAR(255) NOT NULL,
        courseLevel ENUM('beginner', 'intermediate', 'advanced') NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
  );

  return res.status(200).json({
    message: "Institute table created successfully",
    instituteNumber,
  });
};

export {
  createInstitute,
  createTeacherTable,
  createStudentTable,
  createCourseTable,
  catagoryTable,
};
