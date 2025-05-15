"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const s3Client_1 = require("./s3Client");
const bucketName = process.env.S3_BUCKET_NAME;
if (!bucketName) {
    throw new Error("S3_BUCKET_NAME 환경변수가 설정되지 않았습니다.");
}
const uploadPrivate = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: s3Client_1.s3,
        bucket: bucketName,
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            const fileName = `${Date.now()}_${file.originalname}`;
            cb(null, `business/${fileName}`);
        },
    }),
});
exports.default = uploadPrivate;
