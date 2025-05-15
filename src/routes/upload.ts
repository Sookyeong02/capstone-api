import express, { Request, Response } from "express";
import upload from "../utils/uploadPublic";
import {
  uploadProfileImage,
  uploadPortfolioImage,
  uploadJobImage,
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
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: 업로드된 파일 URL 반환
 */
router.post(
  "/business",
  upload.single("file"),
  (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({ message: "파일이 없습니다." });
      return;
    }
    res.status(200).json({ url: (req.file as any).location });
  }
);

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
  upload.single("image"),
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
  upload.single("image"),
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
  upload.single("image"),
  uploadJobImage
);

export default router;
