import express from "express";
import * as authController from "../controllers/authControllers";

const router = express.Router();

/**
 * @swagger
 * /admin/companies:
 *   get:
 *     summary: 승인 대기 중인 기업 회원 목록 조회
 *     tags:
 *       - Admin
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: 승인 대기 중인 기업 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get("/companies", authController.getPendingCompanies);

/**
 * @swagger
 * /admin/companies/{id}/approve:
 *   patch:
 *     summary: 기업 회원 승인 처리
 *     tags:
 *     - Admin
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 기업 사용자 ID
 *     responses:
 *       200:
 *         description: 승인 완료 메시지
 */
router.patch("/companies/:id/approve", authController.approveCompany);

/**
 * @swagger
 * /admin/companies/{id}/reject:
 *   patch:
 *     summary: 기업 회원 거절 처리
 *     tags:
 *       - Admin
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 기업 사용자 ID
 *     responses:
 *       200:
 *         description: 거절 완료 메시지
 */
router.patch("/companies/:id/reject", authController.rejectCompany);

export default router;
