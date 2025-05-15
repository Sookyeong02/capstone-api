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
exports.verifyToken = exports.verifyTokenFromHeader = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const secret = process.env.JWT_SECRET || "my-secret";
// 토큰 생성 함수
const generateToken = (userId, expiresIn = "7d") => {
    const payload = { id: userId };
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
};
exports.generateToken = generateToken;
// 토큰 검증 미들웨어
const verifyTokenFromHeader = (req, res, next) => {
    try {
        const token = req.cookies.accessToken; // httpOnly 쿠키에서 가져옴
        if (!token) {
            res.status(401).json({ message: "토큰이 없습니다." });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.user = decoded; // 이후 미들웨어나 컨트롤러에서 사용자 정보 접근 가능
        next(); // 인증 통과
    }
    catch (err) {
        res.status(401).json({ message: "인증 실패", error: err.message });
    }
};
exports.verifyTokenFromHeader = verifyTokenFromHeader;
// 함수 호출용
const verifyToken = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.accessToken;
    if (!token) {
        throw new Error("토큰이 없습니다.");
    }
    const decoded = jsonwebtoken_1.default.verify(token, secret);
    return decoded;
});
exports.verifyToken = verifyToken;
