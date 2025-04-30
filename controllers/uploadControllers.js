export const uploadProfileImage = (req, res) => {
  if (!req.file) return res.status(400).json({ message: "이미지가 없습니다." });
  res.status(200).json({ imageUrl: req.file.location });
};

export const uploadPortfolioImage = (req, res) => {
  if (!req.file) return res.status(400).json({ message: "이미지가 없습니다." });
  res.status(200).json({ imageUrl: req.file.location });
};

export const uploadJobImage = (req, res) => {
  if (!req.file) return res.status(400).json({ message: "이미지가 없습니다." });
  res.status(200).json({ imageUrl: req.file.location });
};
