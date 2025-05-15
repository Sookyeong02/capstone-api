import express from "express";
import * as authController from "../controllers/authControllers";

const router = express.Router();

/**
 * @swagger
 * /auth/signup/personal:
 *   post:
 *     tags:
 *       - Auth
 *     summary: 개인 회원가입
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - nickname
 *               - password
 *               - passwordConfirm
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               nickname:
 *                 type: string
 *               password:
 *                 type: string
 *               passwordConfirm:
 *                 type: string
 *     responses:
 *       201:
 *         description: 회원가입 성공
 */
// 개인 회원가입
router.post("/signup/personal", authController.signupPersonal);

/**
 * @swagger
 * /auth/signup/company:
 *   post:
 *     tags:
 *       - Auth
 *     summary: 기업 회원가입 (운영자 승인 필요)
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - passwordConfirm
 *               - companyName
 *               - businessNumber
 *               - businessFileUrl
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               passwordConfirm:
 *                 type: string
 *               companyName:
 *                 type: string
 *               businessNumber:
 *                 type: string
 *               businessFileUrl:
 *                 type: string
 *                 format: uri
 *     responses:
 *       201:
 *         description: 기업 회원가입 성공 (승인 대기 상태)
 */
// 기업 회원가입
router.post("/signup/company", authController.signupCompany);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     security: []
 *     summary: 로그인
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: 로그인 성공 (토큰 발급)
 */
// 로그인
router.post("/login", authController.login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     tags:
 *       - Auth
 *     summary: 현재 로그인된 사용자 정보 반환
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: 인증된 사용자 정보
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: 인증 실패
 */
// 현재 로그인된 사용자 정보 반환
router.get("/me", authController.getMe);

router.post("/logout", authController.logout);
router.post("/refresh", authController.refreshAccessToken);

export default router;
