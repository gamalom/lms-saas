import bcrypt from "bcrypt";
const generatePassword = (teacherName: string) => {
  const randomNumber = Math.floor(1000 + Math.random() * 90000);
  const passwordData = {
    hashVersion: bcrypt.hashSync(`${randomNumber}_${teacherName}`, 10),
    plainText: `${randomNumber}_${teacherName}`,
  };
  return passwordData;
};

export default generatePassword;
