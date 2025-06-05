import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

import { swaggerUi, swaggerSpec } from "./swagger";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import portfolioRoutes from "./routes/portfolio";
import jobRoutes from "./routes/job";
import adminRoutes from "./routes/admin";
import uploadRoutes from "./routes/upload";
import hireRoutes from "./routes/hire";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://buildfolio-2025.netlify.app"],
    credentials: true,
  })
);

app.use(cookieParser()); // 쿠키 파싱
app.use(express.json()); // JSON 파싱

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/portfolios", portfolioRoutes);
app.use("/jobs", jobRoutes);
app.use("/admin", adminRoutes);
app.use("/upload", uploadRoutes);
app.use("/hire", hireRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const DB_URL = process.env.DATABASE_URL;

if (!DB_URL) {
  throw new Error("DATABASE_URL is not defined in .env");
}

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("Connected to DB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err: Error) => {
    console.error("DB 연결 실패:", err.message);
  });
