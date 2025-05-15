"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController = __importStar(require("../controllers/authControllers"));
const userController = __importStar(require("../controllers/userControllers"));
const router = express_1.default.Router();
/**
 * @swagger
 * /user/me:
 *   get:
 *     tags:
 *       - User
 *     summary: 내 정보 확인
 *     security:
 *       - cookieAuth: []
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
router.get("/me", authController.verifyAuthToken);
/**
 * @swagger
 * /user/me/personal:
 *   patch:
 *     tags:
 *       - User
 *     summary: 개인 사용자 정보 수정
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               nickname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 description: 새로운 비밀번호
 *               introduction:
 *                 type: string
 *               personalWebsite:
 *                 type: string
 *               profileImage:
 *                 type: string
 *     responses:
 *       200:
 *         description: 수정된 개인 사용자 정보 반환
 */
// (개인)내 정보 수정
router.patch("/me/personal", userController.updatePersonalProfile);
/**
 * @swagger
 * /user/me/company:
 *   patch:
 *     tags:
 *       - User
 *     summary: 기업 사용자 정보 수정
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 description: 새로운 비밀번호
 *               businessNumber:
 *                 type: string
 *                 description: 사업자등록번호 (회사명 변경 시 필수)
 *               businessFileUrl:
 *                 type: string
 *                 description: 사업자등록증 파일 URL (회사명 변경 시 필수)
 *               companyIntroduction:
 *                 type: string
 *               companyWebsite:
 *                 type: string
 *               profileImage:
 *                 type: string
 *     responses:
 *       200:
 *         description: 수정된 기업 사용자 정보 반환
 */
// (기업)내 정보 수정
router.patch("/me/company", userController.updateCompanyProfile);
/**
 * @swagger
 * /user/portfolios:
 *   get:
 *     tags:
 *       - User
 *     summary: 내가 작성한 포트폴리오 목록 조회
 *     security:
 *       - cookieAuth: []
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
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: 내가 등록한 채용공고 리스트
 */
router.get("/jobs", userController.getMyJobs);
exports.default = router;
