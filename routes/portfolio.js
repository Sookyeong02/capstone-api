import express from "express";
import * as portfolioController from "../controllers/portfolioControllers.js";

const router = express.Router();

/**
 * @swagger
 * /portfolios:
 *   get:
 *     tags:
 *       - Portfolios
 *     summary: 포트폴리오 전체 조회 (카테고리 필터, 정렬, 페이지네이션 포함)
 *     security: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: 카테고리 필터
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 제목, 태그, 콘텐츠 내용으로 검색
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [latest, likes]
 *         description: "정렬 기준 (latest: 최신순, likes: 좋아요순)"
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
 *         description: 포트폴리오 리스트
 */
router.get("/", portfolioController.getAll);

/**
 * @swagger
 * /portfolios/{id}:
 *   get:
 *     tags:
 *       - Portfolios
 *     summary: 포트폴리오 상세 조회
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 포트폴리오 ID
 *     responses:
 *       200:
 *         description: 포트폴리오 상세 정보 반환
 */
router.get("/:id", portfolioController.getOne);

/**
 * @swagger
 * /portfolios:
 *   post:
 *     tags:
 *       - Portfolios
 *     summary: 포트폴리오 등록
 *     security:
 *       - bearerAuth: []
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
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               contentBlocks:
 *                 type: array
 *                 items:
 *                   type: object
 *               thumbnail:
 *                 type: string
 *     responses:
 *       201:
 *         description: 등록 성공
 */
router.post("/", portfolioController.create);

/**
 * @swagger
 * /portfolios/{id}:
 *   patch:
 *     tags:
 *       - Portfolios
 *     summary: 포트폴리오 수정
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: 수정된 포트폴리오 반환
 */
router.patch("/:id", portfolioController.update);

/**
 * @swagger
 * /portfolios/{id}:
 *   delete:
 *     tags:
 *       - Portfolios
 *     summary: 포트폴리오 삭제
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: 삭제 성공
 */
router.delete("/:id", portfolioController.remove);

/**
 * @swagger
 * /portfolios/{id}/like:
 *   post:
 *     tags:
 *       - Portfolios
 *     summary: 포트폴리오 좋아요 토글
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 좋아요 상태 변경 결과 반환
 */
router.post("/:id/like", portfolioController.toggleLike);

/**
 * @swagger
 * /portfolios/{id}/likes:
 *   get:
 *     tags:
 *       - Portfolios
 *     summary: 지정 포트폴리오의 좋아요 수 가지기
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 좋아요 수
 */
router.get("/:id/likes", portfolioController.getLikeCount);

/**
 * @swagger
 * /portfolios/liked:
 *   get:
 *     tags:
 *       - Portfolios
 *     summary: 내가 좋아요한 포트폴리오 목록
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 좋아요한 포트폴리오 목록
 */
router.get("/liked", portfolioController.getLikedPortfolios);

export default router;
