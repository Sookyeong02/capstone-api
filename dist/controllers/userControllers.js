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
exports.getMyJobs = exports.getMyPortfolios = exports.updateCompanyProfile = exports.updatePersonalProfile = void 0;
const User_1 = __importDefault(require("../models/User"));
const Job_1 = __importDefault(require("../models/Job"));
const Portfolio_1 = __importDefault(require("../models/Portfolio"));
const jwt_1 = require("../utils/jwt");
const password_1 = require("../utils/password");
// (개인) 내 정보 수정
const updatePersonalProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tokenData = yield (0, jwt_1.verifyToken)(req);
        const user = yield User_1.default.findById(tokenData.id);
        if (!user || user.role !== "personal") {
            res.status(403).json({ message: "권한이 없습니다." });
            return;
        }
        const { name, nickname, email, password, introduction, personalWebsite, profileImage, } = req.body;
        if (name)
            user.name = name;
        if (nickname)
            user.nickname = nickname;
        if (email)
            user.email = email;
        if (password)
            user.password = yield (0, password_1.hashPassword)(password);
        if (introduction)
            user.introduction = introduction;
        if (personalWebsite)
            user.personalWebsite = personalWebsite;
        if (profileImage)
            user.profileImage = profileImage;
        yield user.save();
        res.json({
            id: user._id,
            email: user.email,
            name: user.name,
            nickname: user.nickname,
            profileImageUrl: user.profileImage || "",
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    }
    catch (err) {
        res.status(401).json({ message: "인증 실패" });
    }
});
exports.updatePersonalProfile = updatePersonalProfile;
// (기업) 내 정보 수정
const updateCompanyProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tokenData = yield (0, jwt_1.verifyToken)(req);
        const user = yield User_1.default.findById(tokenData.id);
        if (!user || user.role !== "company") {
            res.status(403).json({ message: "권한이 없습니다." });
            return;
        }
        const { companyName, email, password, businessNumber, businessFileUrl, companyIntroduction, companyWebsite, profileImage, } = req.body;
        // if (companyName) user.companyName = companyName;
        if (companyName && companyName !== user.companyName) {
            user.companyName = companyName;
            user.status = "pending"; // 승인 다시 받도록
        }
        if (email)
            user.email = email;
        if (password)
            user.password = yield (0, password_1.hashPassword)(password);
        if (businessNumber)
            user.businessNumber = businessNumber;
        if (businessFileUrl)
            user.businessFileUrl = businessFileUrl;
        if (companyIntroduction)
            user.companyIntroduction = companyIntroduction;
        if (companyWebsite)
            user.companyWebsite = companyWebsite;
        if (profileImage)
            user.profileImage = profileImage;
        yield user.save();
        res.json({
            id: user._id,
            email: user.email,
            companyName: user.companyName,
            profileImageUrl: user.profileImage || "",
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            status: user.status,
        });
    }
    catch (err) {
        res.status(401).json({ message: "인증 실패" });
    }
});
exports.updateCompanyProfile = updateCompanyProfile;
// 내 포트폴리오 조회
const getMyPortfolios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tokenData = yield (0, jwt_1.verifyToken)(req);
        const myPortfolios = yield Portfolio_1.default.find({ userId: tokenData.id }).sort({
            createdAt: -1,
        });
        res.json(myPortfolios);
    }
    catch (_a) {
        res.status(401).json({ message: "인증 실패" });
    }
});
exports.getMyPortfolios = getMyPortfolios;
// 내 채용공고 조회
const getMyJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tokenData = yield (0, jwt_1.verifyToken)(req);
        const jobs = yield Job_1.default.find({ companyId: tokenData.id }).sort({
            createdAt: -1,
        });
        res.json(jobs);
    }
    catch (error) {
        res.status(401).json({ message: "인증 실패", error: error.message });
    }
});
exports.getMyJobs = getMyJobs;
