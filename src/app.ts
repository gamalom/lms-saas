import express from "express";
import authRoute from "./routes/globals/auth/auth.route";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", authRoute);

export default app;
