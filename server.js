import express from "express";
import { swaggerUi, swaggerSpec } from "./swagger.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import portfolioRoutes from "./routes/portfolio.js";
import jobRoutes from "./routes/job.js";

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/portfolios", portfolioRoutes);
app.use("/jobs", jobRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // 중요!!

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});
