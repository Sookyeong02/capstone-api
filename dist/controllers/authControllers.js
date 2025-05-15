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
exports.rejectCompany = exports.approveCompany = exports.getPendingCompanies = exports.refreshAccessToken = exports.logout = exports.getMe = exports.verifyAuthToken = exports.login = exports.signupCompany = exports.signupPersonal = void 0;
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
// 개인 회원가입
const signupPersonal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, nickname, password, passwordConfirm } = req.body;
    if (!name || !email || !nickname || !password || !passwordConfirm) {
        res.status(400).json({ message: "모든 필드를 입력해주세요." });
    }
    if (password !== passwordConfirm)
        res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
    const exists = yield User_1.default.findOne({ email });
    if (exists)
        res.status(409).json({ message: "이미 존재하는 이메일입니다." });
    const hashed = yield (0, password_1.hashPassword)(password);
    const newUser = yield User_1.default.create({
        role: "personal",
        provider: "local",
        name,
        email,
        nickname,
        password: hashed,
    });
    res.status(201).json({ message: "회원가입 성공", userId: newUser._id });
});
exports.signupPersonal = signupPersonal;
// 기업 회원가입
const signupCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, companyName, password, passwordConfirm, businessNumber, businessFileUrl, } = req.body;
    if (!email ||
        !companyName ||
        !password ||
        !passwordConfirm ||
        !businessNumber ||
        !businessFileUrl) {
        res.status(400).json({ message: "모든 필드를 입력해주세요.(파일 포함)" });
    }
    if (password !== passwordConfirm)
        res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
    const exists = yield User_1.default.findOne({ email });
    if (exists)
        res.status(409).json({ message: "이미 존재하는 이메일입니다." });
    const hashed = yield (0, password_1.hashPassword)(password);
    const newCompany = yield User_1.default.create({
        role: "company",
        provider: "local",
        email,
        password: hashed,
        companyName,
        businessNumber,
        businessFileUrl,
        status: "pending",
    });
    res
        .status(201)
        .json({ message: "기업 회원가입 성공", userId: newCompany._id });
});
exports.signupCompany = signupCompany;
// 로그인
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "존재하지 않는 사용자입니다." });
            return;
        }
        // 기업 계정인데 승인되지 않은 경우 로그인 거부
        if (user.role === "company" && user.status !== "approved") {
            res.status(403).json({ message: "관리자의 승인이 필요합니다." });
            return;
        }
        const isMatch = yield (0, password_1.comparePassword)(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: "비밀번호가 틀렸습니다." });
            return;
        }
        const accessToken = (0, jwt_1.generateToken)(user._id);
        const refreshToken = (0, jwt_1.generateToken)(user._id, "14d");
        const userWithoutPassword = yield User_1.default.findById(user._id).select("-password");
        // 쿠키 설정
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 2, // 2시간
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24 * 14, // 14일
        });
        // accessToken, refreshToken은 JSON으로 안 보냄
        res.json({
            message: "로그인 성공",
            user: userWithoutPassword,
        });
    }
    catch (err) {
        console.error("[login error]", err);
        res.status(500).json({ message: "서버 에러가 발생했습니다." });
    }
});
exports.login = login;
// 토큰 확인용
const verifyAuthToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tokenData = yield (0, jwt_1.verifyToken)(req); // id만 포함됨
        const user = yield User_1.default.findById(tokenData.id).select("-password"); // 전체 사용자 정보 반환
        res.json({ message: "인증 성공", user });
    }
    catch (_a) {
        res.status(401).json({ message: "인증 실패" });
    }
});
exports.verifyAuthToken = verifyAuthToken;
const secret = process.env.JWT_SECRET;
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.accessToken; // 쿠키에서 accessToken 직접 읽기
        if (!token) {
            res.status(401).json({ message: "토큰이 없습니다." });
        }
        const decoded = jsonwebtoken_1.default.verify(token, secret); // jwt로 복호화
        const user = yield User_1.default.findById(decoded.id).select("-password");
        if (!user) {
            res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
        }
        res.json({ user });
    }
    catch (err) {
        res.status(401).json({ message: "인증 실패", error: err.message });
    }
});
exports.getMe = getMe;
// 로그아웃: 쿠키 삭제
const logout = (req, res) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
    });
    res.json({ message: "로그아웃 되었습니다." });
};
exports.logout = logout;
// 리프레시 토큰을 이용해 accessToken 재발급
const refreshAccessToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            res.status(401).json({ message: "리프레시 토큰 없음" });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(refreshToken, secret);
        const user = yield User_1.default.findById(decoded.id).select("-password");
        if (!user) {
            res.status(401).json({ message: "유효하지 않은 사용자" });
            return;
        }
        const newAccessToken = jsonwebtoken_1.default.sign({ id: user._id }, secret, {
            expiresIn: "2h",
        });
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 1000 * 60 * 60 * 2, // 2시간
        });
        res.json({ message: "토큰 재발급 완료" });
    }
    catch (err) {
        res
            .status(401)
            .json({ message: "리프레시 토큰이 유효하지 않음", error: err.message });
    }
});
exports.refreshAccessToken = refreshAccessToken;
// 대기 중인 기업 목록 조회
const getPendingCompanies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenData = yield (0, jwt_1.verifyToken)(req); // 토큰에서 id만 추출
    const admin = yield User_1.default.findById(tokenData.id); // DB에서 유저 정보 조회
    if (!admin || admin.role !== "admin") {
        res.status(403).json({ message: "권한이 없습니다." });
    }
    const pendingCompanies = yield User_1.default.find({
        role: "company",
        status: "pending",
    });
    res.json(pendingCompanies);
});
exports.getPendingCompanies = getPendingCompanies;
// 기업 승인
const approveCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenData = yield (0, jwt_1.verifyToken)(req); // 토큰에서 id만 추출
    const admin = yield User_1.default.findById(tokenData.id); // DB에서 유저 정보 조회
    if (!admin || admin.role !== "admin") {
        res.status(403).json({ message: "권한이 없습니다." });
        return;
    }
    const company = yield User_1.default.findById(req.params.id);
    if (!company || company.role !== "company") {
        res.status(404).json({ message: "기업 사용자를 찾을 수 없습니다." });
        return;
    }
    company.status = "approved";
    yield company.save();
    res.json({ message: "승인 완료" });
    return;
});
exports.approveCompany = approveCompany;
// 기업 거절
const rejectCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenData = yield (0, jwt_1.verifyToken)(req); // 토큰에서 id만 추출
    const admin = yield User_1.default.findById(tokenData.id); // DB에서 유저 정보 조회
    if (!admin || admin.role !== "admin") {
        res.status(403).json({ message: "권한이 없습니다." });
        return;
    }
    const company = yield User_1.default.findById(req.params.id);
    if (!company || company.role !== "company") {
        res.status(404).json({ message: "기업 사용자를 찾을 수 없습니다." });
        return;
    }
    company.status = "rejected";
    yield company.save();
    res.json({ message: "거절 완료" });
    return;
});
exports.rejectCompany = rejectCompany;
