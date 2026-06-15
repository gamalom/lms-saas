import express from "express";
import authRoute from "./routes/globals/auth/auth.route";
import instituteRoute from "./routes/institute/institute.route";
import studentRoute from "./routes/student/student.route";
import courseRoute from "./routes/institute/course.route";
import teacherRoute from "./routes/institute/teacher/teacher.route";
import categoryRoute from "./routes/institute/category.route";
import teacherLoginRoute from "./routes/teacher/teacher.route";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//global routes
app.use("/api", authRoute);
//institute routes
app.use("/api", instituteRoute);
app.use("/api", studentRoute);
app.use("/api", courseRoute);
app.use("/api", teacherRoute);
app.use("/api", categoryRoute);

//teacher routes
app.use("/api", teacherLoginRoute);

export default app;
