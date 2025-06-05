import { Router } from "express";
import * as hireController from "../controllers/hireControllers";
import { verifyTokenFromHeader } from "../utils/jwt";

const router = Router();

router.post(
  "/hire/portfolio/:id",
  verifyTokenFromHeader,
  hireController.sendHireRequestByPortfolioId
);

router.post(
  "/hire/user/:id",
  verifyTokenFromHeader,
  hireController.sendHireRequestByUserId
);

export default router;
