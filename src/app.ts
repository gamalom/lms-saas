import express from "express";
import authRoute from "./routes/globals/auth/auth.route";
import instituteRoute from "./routes/institute/institute.route";
import studentRoute from "./routes/student/student.route";
import courseRoute from "./routes/institute/course.route";
import teacherRoute from "./routes/institute/teacher/teacher.route";
import categoryRoute from "./routes/institute/category.route";
import teacherLoginRoute from "./routes/teacher/teacher.route";
import cors from "cors";
const app = express();

//cors
app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//global routes
app.use("/api/auth/", authRoute);
//institute routes
app.use("/api/institute", instituteRoute);
app.use("/api/institute", studentRoute);
app.use("/api/institute", courseRoute);
app.use("/api/institute", teacherRoute);
app.use("/api/institute", categoryRoute);

//teacher routes
app.use("/api", teacherLoginRoute);

export default app;
