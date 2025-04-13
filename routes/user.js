import express from "express";
import * as authController from "../controllers/authControllers.js";
import * as userController from "../controllers/userControllers.js";

const router = express.Router();

/**
 * @swagger
 * /user/me:
 *   get:
 *     tags:
 *       - User
 *     summary: 내 정보 확인 (토큰 필요)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 사용자 정보 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 */
// 내 정보 확인 (JWT 인증 필요)
router.get("/me", authController.verifyToken);

/**
 * @swagger
 * /user/me:
 *   patch:
 *     tags:
 *       - User
 *     summary: 내 정보 수정
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nickname:
 *                 type: string
 *               introduction:
 *                 type: string
 *               personalWebsite:
 *                 type: string
 *               companyIntroduction:
 *                 type: string
 *               companyWebsite:
 *                 type: string
 *               profileImage:
 *                 type: string
 *     responses:
 *       200:
 *         description: 수정된 사용자 정보 반환
 */
// 내 정보 수정
router.patch("/me", userController.updateProfile);

/**
 * @swagger
 * /user/portfolios:
 *   get:
 *     tags:
 *       - User
 *     summary: 내가 작성한 포트폴리오 목록 조회
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 작성한 포트폴리오 목록 반환
 */
// 내가 작성한 포트폴리오 조회
router.get("/portfolios", userController.getMyPortfolios);

/**
 * @swagger
 * /user/jobs:
 *   get:
 *     tags:
 *       - User
 *     summary: 내가 작성한 채용공고 목록 조회
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 내가 등록한 채용공고 리스트
 */
router.get("/jobs", userController.getMyJobs);

export default router;
