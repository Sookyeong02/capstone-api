import { Request, Response } from "express";

interface MulterFile extends Express.Multer.File {
  location?: string;
}

interface MulterRequest extends Request {
  file?: MulterFile;
}

export const uploadProfileImage = (req: MulterRequest, res: Response) => {
  if (!req.file || !req.file.location) {
    res.status(400).json({ message: "이미지가 없습니다." });
    return;
  }
  res.status(200).json({ imageUrl: req.file.location });
};

export const uploadPortfolioImage = (req: MulterRequest, res: Response) => {
  if (!req.file || !req.file.location) {
    res.status(400).json({ message: "이미지가 없습니다." });
    return;
  }
  res.status(200).json({ imageUrl: req.file.location });
};

export const uploadJobImage = (req: MulterRequest, res: Response) => {
  if (!req.file || !req.file.location) {
    res.status(400).json({ message: "이미지가 없습니다." });
    return;
  }
  res.status(200).json({ imageUrl: req.file.location });
};
