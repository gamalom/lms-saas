import express from "express";
import authRoute from "./routes/globals/auth/auth.route";
import instituteRoute from "./routes/institute/institute.route";
import studentRoute from "./routes/student/student.route";
import courseRoute from "./routes/institute/course.route";
import teacherRoute from "./routes/teacher/teacher.route";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", authRoute);
app.use("/api", instituteRoute);
app.use("/api", studentRoute);
app.use("/api", courseRoute);
app.use("/api", teacherRoute);

export default app;
