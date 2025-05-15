"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLikedPortfolios = exports.getLikeCount = exports.toggleLike = exports.remove = exports.update = exports.create = exports.getOne = exports.getAll = void 0;
const Portfolio_1 = __importDefault(require("../models/Portfolio"));
const Like_1 = __importDefault(require("../models/Like"));
const jwt_1 = require("../utils/jwt");
// 전체 조회
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category, sort = "latest", page = 1, limit = 9, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    let filter = {};
    if (category)
        filter.category = category;
    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: "i" } },
            { tags: { $regex: search, $options: "i" } },
            { "contentBlocks.content": { $regex: search, $options: "i" } },
        ];
    }
    const total = yield Portfolio_1.default.countDocuments(filter);
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = Number(page) < totalPages;
    let portfolios = yield Portfolio_1.default.find(filter)
        .sort(sort === "likes" ? {} : { createdAt: -1 })
        .skip(Number(skip))
        .limit(Number(limit))
        .lean();
    if (sort === "likes") {
        const likeCounts = yield Like_1.default.aggregate([
            { $group: { _id: "$portfolioId", count: { $sum: 1 } } },
        ]);
        const likeMap = Object.fromEntries(likeCounts.map((l) => [l._id.toString(), l.count]));
        portfolios.forEach((p) => {
            p.likeCount = likeMap[p._id.toString()] || 0;
        });
        portfolios.sort((a, b) => b.likeCount - a.likeCount);
    }
    res.json({
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages,
        hasNextPage,
        data: portfolios,
    });
});
exports.getAll = getAll;
// 상세 조회
const getOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const portfolio = yield Portfolio_1.default.findById(req.params.id);
    if (!portfolio)
        res.status(404).json({ message: "포트폴리오를 찾을 수 없습니다." });
    res.json(portfolio);
});
exports.getOne = getOne;
// 등록
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenData = yield (0, jwt_1.verifyToken)(req);
    const newPortfolio = yield Portfolio_1.default.create(Object.assign(Object.assign({}, req.body), { userId: tokenData.id }));
    res.status(201).json(newPortfolio);
});
exports.create = create;
// 수정
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenData = yield (0, jwt_1.verifyToken)(req);
    const portfolio = yield Portfolio_1.default.findById(req.params.id);
    if (!portfolio) {
        res.status(404).json({ message: "포트폴리오를 찾을 수 없습니다." });
        return;
    }
    if (portfolio.userId.toString() !== tokenData.id) {
        res.status(403).json({ message: "수정 권한이 없습니다." });
        return;
    }
    Object.assign(portfolio, req.body);
    yield portfolio.save();
    res.json(portfolio);
});
exports.update = update;
// 삭제
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenData = yield (0, jwt_1.verifyToken)(req);
    const portfolio = yield Portfolio_1.default.findById(req.params.id);
    if (!portfolio) {
        res.status(404).json({ message: "포트폴리오를 찾을 수 없습니다." });
        return;
    }
    if (portfolio.userId.toString() !== tokenData.id) {
        res.status(403).json({ message: "삭제 권한이 없습니다." });
        return;
    }
    yield Portfolio_1.default.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
});
exports.remove = remove;
// 좋아요
const toggleLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenData = yield (0, jwt_1.verifyToken)(req);
    const { id: portfolioId } = req.params;
    const userId = tokenData.id;
    const existingLike = yield Like_1.default.findOne({ userId, portfolioId });
    if (existingLike) {
        yield Like_1.default.findByIdAndDelete(existingLike._id);
        res.json({ liked: false, message: "좋아요 취소됨" });
    }
    else {
        yield Like_1.default.create({ userId, portfolioId });
        res.json({ liked: true, message: "좋아요 추가됨" });
    }
});
exports.toggleLike = toggleLike;
// 좋아요 수 가져오기
const getLikeCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: portfolioId } = req.params;
    const count = yield Like_1.default.countDocuments({ portfolioId });
    res.json({ portfolioId, likeCount: count });
});
exports.getLikeCount = getLikeCount;
// 내가 좋아요한 포트폴리오 목록
const getLikedPortfolios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenData = yield (0, jwt_1.verifyToken)(req);
    const likes = yield Like_1.default.find({ userId: tokenData.id }).select("portfolioId");
    const portfolioIds = likes.map((like) => like.portfolioId);
    const portfolios = yield Portfolio_1.default.find({ _id: { $in: portfolioIds } });
    res.json(portfolios);
});
exports.getLikedPortfolios = getLikedPortfolios;
