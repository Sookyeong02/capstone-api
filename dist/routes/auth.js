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
const router = express_1.default.Router();
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
exports.default = router;
