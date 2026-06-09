import { config } from "dotenv";
import app from "./src/app";
import sequelize from "./src/Database/connection";

config();

async function startServer() {
  try {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
  }

  await sequelize.authenticate();
  console.log("Connection has been established successfully.");
  await sequelize.sync({ alter: false });
  console.log("Database and tables synced!");
}

startServer();

export default app;
