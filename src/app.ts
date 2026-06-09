import express from "express";
import authRoute from "./routes/globals/auth/auth.route";
import instituteRoute from "./routes/institute/institute.route";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", authRoute);
app.use("/api", instituteRoute);

export default app;
