import express from "express";
import uploadPublic from "../utils/uploadPublic";
import uploadPrivate from "../utils/uploadPrivate";
import {
  uploadProfileImage,
  uploadPortfolioImage,
  uploadJobImage,
  uploadBusinessFile,
} from "../controllers/uploadControllers";
import { verifyTokenFromHeader } from "../utils/jwt";

const router = express.Router();

/**
 * @swagger
 * /upload/business:
 *   post:
 *     tags:
 *       - Auth
 *     summary: 사업자등록증 이미지 업로드
 *     consumes:
 *       - multipart/form-data
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: 업로드된 파일 URL 반환
 */
router.post("/business", uploadPrivate.single("file"), uploadBusinessFile);

/**
 * @swagger
 * /upload/profile:
 *   post:
 *     summary: 프로필 이미지 업로드 (개인/기업)
 *     tags: [User]
 *     consumes:
 *       - multipart/form-data
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: 업로드 성공
 */
router.post(
  "/profile",
  verifyTokenFromHeader,
  uploadPublic.single("image"),
  uploadProfileImage
);

/**
 * @swagger
 * /upload/portfolio:
 *   post:
 *     summary: 포트폴리오 이미지 업로드
 *     tags: [Portfolios]
 *     consumes:
 *       - multipart/form-data
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: 업로드 성공
 */
router.post(
  "/portfolio",
  verifyTokenFromHeader,
  uploadPublic.single("image"),
  uploadPortfolioImage
);

/**
 * @swagger
 * /upload/job:
 *   post:
 *     summary: 채용공고 썸네일 이미지 업로드
 *     tags: [Jobs]
 *     consumes:
 *       - multipart/form-data
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: 업로드 성공
 */
router.post(
  "/job",
  verifyTokenFromHeader,
  uploadPublic.single("image"),
  uploadJobImage
);

export default router;
