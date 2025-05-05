import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import cors from "cors";

dotenv.config();

import { swaggerUi, swaggerSpec } from "./swagger.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import portfolioRoutes from "./routes/portfolio.js";
import jobRoutes from "./routes/job.js";
import adminRoutes from "./routes/admin.js";
import uploadRoutes from "./routes/upload.js";

const app = express();

const allowedOrigins = [
  "http://localhost:3000", // 개발용
  "https://buildfolio-2025.netlify.app", // 배포된 프론트 주소
];

// CORS 설정
app.use(
  cors({
    origin: (origin, callback) => {
      // origin이 없을 경우 (ex: 서버 간 요청)은 허용
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS 정책에 의해 차단된 요청입니다."));
      }
    },
    credentials: true,
  })
);

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
