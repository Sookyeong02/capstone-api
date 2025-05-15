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
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("./models/User"));
dotenv_1.default.config();
const createAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dbUrl = process.env.DATABASE_URL;
        const adminPassword = process.env.ADMIN_PASSWORD;
        if (!dbUrl || !adminPassword) {
            throw new Error("환경변수 DATABASE_URL 또는 ADMIN_PASSWORD가 설정되지 않았습니다.");
        }
        yield mongoose_1.default.connect(dbUrl);
        const exists = yield User_1.default.findOne({ email: "capstone@gmail.com" });
        if (exists) {
            console.log("이미 존재하는 관리자 계정입니다.");
            process.exit(0);
        }
        const hashed = yield bcrypt_1.default.hash(adminPassword, 10);
        yield User_1.default.create({
            email: "capstone@gmail.com",
            password: hashed,
            role: "admin",
            provider: "local",
            status: "approved",
        });
        console.log("관리자 계정 생성 완료!");
        process.exit();
    }
    catch (err) {
        console.error("관리자 계정 생성 실패:", err);
        process.exit(1);
    }
});
createAdmin();
