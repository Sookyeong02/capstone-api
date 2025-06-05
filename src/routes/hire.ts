import { Router } from "express";
import * as hireController from "../controllers/hireControllers";
import { verifyTokenFromHeader } from "../utils/jwt";

const router = Router();

// 포트폴리오 기반
router.post(
  "/portfolio/:id",
  verifyTokenFromHeader,
  hireController.sendHireRequestByPortfolioId
);

// 사용자 프로필 기반
router.post(
  "/user/:id",
  verifyTokenFromHeader,
  hireController.sendHireRequestByUserId
);

export default router;
