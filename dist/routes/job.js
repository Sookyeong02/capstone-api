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
const jobController = __importStar(require("../controllers/jobControllers"));
const router = express_1.default.Router();
/**
 * @swagger
 * /jobs:
 *   get:
 *     tags:
 *       - Jobs
 *     summary: 채용공고 전체 조회
 *     security: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 페이지 번호
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 9
 *         description: 페이지당 항목 수
 *     responses:
 *       200:
 *         description: 채용공고 목록 반환
 */
router.get("/", jobController.getAll);
/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     tags:
 *       - Jobs
 *     summary: 채용공고 상세 조회
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 채용공고 ID
 *     responses:
 *       200:
 *         description: 채용공고 상세 정보 반환
 */
router.get("/:id", jobController.getOne);
/**
 * @swagger
 * /jobs:
 *   post:
 *     tags:
 *       - Jobs
 *     summary: 채용공고 등록
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - link
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               experience:
 *                 type: string
 *               content:
 *                 type: string
 *               link:
 *                 type: string
 *               deadline:
 *                 type: string
 *                 format: date
 *               location:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *     responses:
 *       201:
 *         description: 채용공고 등록 성공
 */
// 채용 공고 등록
router.post("/", jobController.create);
/**
 * @swagger
 * /jobs/{id}:
 *   patch:
 *     tags:
 *       - Jobs
 *     summary: 채용공고 수정
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 수정할 채용공고의 ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               experience:
 *                 type: string
 *               content:
 *                 type: string
 *               link:
 *                 type: string
 *               deadline:
 *                 type: string
 *                 format: date
 *               location:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *     responses:
 *       200:
 *         description: 채용공고 수정 성공
 */
// 채용 공고 수정
router.patch("/:id", jobController.update);
/**
 * @swagger
 * /jobs/{id}:
 *   delete:
 *     tags:
 *       - Jobs
 *     summary: 채용공고 삭제
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: 채용공고 삭제 성공
 */
router.delete("/:id", jobController.remove);
exports.default = router;
