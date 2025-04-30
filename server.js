import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

import { swaggerUi, swaggerSpec } from "./swagger.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import portfolioRoutes from "./routes/portfolio.js";
import jobRoutes from "./routes/job.js";
import adminRoutes from "./routes/admin.js";
import uploadRoutes from "./routes/upload.js";

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/portfolios", portfolioRoutes);
app.use("/jobs", jobRoutes);
app.use("/admin", adminRoutes);
app.use("/upload", uploadRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // 중요!!

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Connected to DB");
    app.listen(process.env.PORT || 3000, () => {
      console.log("Server started");
    });
  })
  .catch((err) => {
    console.error("DB 연결 실패:", err.message);
  });
