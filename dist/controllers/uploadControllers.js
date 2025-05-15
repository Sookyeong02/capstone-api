"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadJobImage = exports.uploadPortfolioImage = exports.uploadProfileImage = void 0;
const uploadProfileImage = (req, res) => {
    if (!req.file || !req.file.location) {
        res.status(400).json({ message: "이미지가 없습니다." });
        return;
    }
    res.status(200).json({ imageUrl: req.file.location });
};
exports.uploadProfileImage = uploadProfileImage;
const uploadPortfolioImage = (req, res) => {
    if (!req.file || !req.file.location) {
        res.status(400).json({ message: "이미지가 없습니다." });
        return;
    }
    res.status(200).json({ imageUrl: req.file.location });
};
exports.uploadPortfolioImage = uploadPortfolioImage;
const uploadJobImage = (req, res) => {
    if (!req.file || !req.file.location) {
        res.status(400).json({ message: "이미지가 없습니다." });
        return;
    }
    res.status(200).json({ imageUrl: req.file.location });
};
exports.uploadJobImage = uploadJobImage;
