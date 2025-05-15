"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
/**
 * 비밀번호 해시화
 * @param plain - 평문 비밀번호
 * @returns 해시된 비밀번호
 */
const hashPassword = (plain) => {
    return bcrypt_1.default.hash(plain, 10);
};
exports.hashPassword = hashPassword;
/**
 * 평문과 해시된 비밀번호 비교
 * @param plain - 입력된 평문 비밀번호
 * @param hashed - DB에 저장된 해시 비밀번호
 * @returns 일치 여부 (true/false)
 */
const comparePassword = (plain, hashed) => {
    return bcrypt_1.default.compare(plain, hashed);
};
exports.comparePassword = comparePassword;
