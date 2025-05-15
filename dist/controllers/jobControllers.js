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
exports.remove = exports.update = exports.create = exports.getOne = exports.getAll = void 0;
const Job_1 = __importDefault(require("../models/Job"));
const jwt_1 = require("../utils/jwt");
// 전체 조회
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(String(req.query.page)) || 1;
    const limit = parseInt(String(req.query.limit)) || 10;
    const skip = (page - 1) * limit;
    const total = yield Job_1.default.countDocuments();
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const jobs = yield Job_1.default.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    res.json({
        total,
        page,
        limit,
        totalPages,
        hasNextPage,
        data: jobs,
    });
});
exports.getAll = getAll;
// 상세 조회
const getOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const job = yield Job_1.default.findById(req.params.id);
    if (!job)
        res.status(404).json({ message: "채용공고를 찾을 수 없습니다." });
    res.json(job);
});
exports.getOne = getOne;
// 등록
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenData = yield (0, jwt_1.verifyToken)(req);
    const newJob = yield Job_1.default.create(Object.assign(Object.assign({}, req.body), { companyId: tokenData.id }));
    res.status(201).json(newJob);
});
exports.create = create;
// 수정
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenData = yield (0, jwt_1.verifyToken)(req);
    const job = yield Job_1.default.findById(req.params.id);
    if (!job) {
        res.status(404).json({ message: "채용공고를 찾을 수 없습니다." });
        return;
    }
    if (job.companyId.toString() !== tokenData.id) {
        res.status(403).json({ message: "수정 권한이 없습니다." });
        return;
    }
    Object.assign(job, req.body);
    yield job.save();
    res.json(job);
});
exports.update = update;
// 삭제
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenData = yield (0, jwt_1.verifyToken)(req);
    const job = yield Job_1.default.findById(req.params.id);
    if (!job) {
        res.status(404).json({ message: "채용공고를 찾을 수 없습니다." });
        return;
    }
    if (job.companyId.toString() !== tokenData.id) {
        res.status(403).json({ message: "삭제 권한이 없습니다." });
        return;
    }
    yield Job_1.default.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
});
exports.remove = remove;
