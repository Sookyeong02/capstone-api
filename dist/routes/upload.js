"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uploadPublic_1 = __importDefault(require("../utils/uploadPublic"));
const uploadControllers_1 = require("../controllers/uploadControllers");
const jwt_1 = require("../utils/jwt");
const router = express_1.default.Router();
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
router.post("/business", uploadPublic_1.default.single("file"), (req, res) => {
    if (!req.file) {
        res.status(400).json({ message: "파일이 없습니다." });
        return;
    }
    res.status(200).json({ url: req.file.location });
});
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
router.post("/profile", jwt_1.verifyTokenFromHeader, uploadPublic_1.default.single("image"), uploadControllers_1.uploadProfileImage);
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
router.post("/portfolio", jwt_1.verifyTokenFromHeader, uploadPublic_1.default.single("image"), uploadControllers_1.uploadPortfolioImage);
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
router.post("/job", jwt_1.verifyTokenFromHeader, uploadPublic_1.default.single("image"), uploadControllers_1.uploadJobImage);
exports.default = router;
