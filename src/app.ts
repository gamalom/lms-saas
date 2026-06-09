import express from "express";
import authRoute from "./routes/globals/auth/auth.route";

const app = express();

app.use("/api", authRoute);

export default app;
