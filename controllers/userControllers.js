import User from "../models/User.js";
import Portfolio from "../models/Portfolio.js";
import { verifyTokenFromHeader } from "../utils/jwt.js";

export const updateProfile = async (req, res) => {
  try {
    const tokenData = await verifyTokenFromHeader(req);
    const user = await User.findById(tokenData.id);

    if (!user)
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });

    const {
      nickname,
      introduction,
      personalWebsite,
      companyIntroduction,
      companyWebsite,
      profileImage,
    } = req.body;

    if (user.role === "personal") {
      if (nickname) user.nickname = nickname;
      if (introduction) user.introduction = introduction;
      if (personalWebsite) user.personalWebsite = personalWebsite;
    } else if (user.role === "company") {
      if (companyIntroduction) user.companyIntroduction = companyIntroduction;
      if (companyWebsite) user.companyWebsite = companyWebsite;
    }

    if (profileImage) user.profileImage = profileImage;

    await user.save();

    res.json({
      id: user._id,
      email: user.email,
      nickname: user.nickname || "",
      profileImageUrl: user.profileImage || "",
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch {
    res.status(401).json({ message: "인증 실패" });
  }
};

// 내 포트폴리오 조회
export const getMyPortfolios = async (req, res) => {
  try {
    const tokenData = await verifyTokenFromHeader(req);
    const myPortfolios = await Portfolio.find({ userId: tokenData.id }).sort({
      createdAt: -1,
    });
    res.json(myPortfolios);
  } catch {
    res.status(401).json({ message: "인증 실패" });
  }
};

// 내 채용공고 조회
export const getMyJobs = async (req, res) => {
  try {
    const tokenData = await verifyTokenFromHeader(req);
    const jobs = await Job.find({ companyId: tokenData.id }).sort({
      createdAt: -1,
    });
    res.json(jobs);
  } catch (error) {
    res.status(401).json({ message: "인증 실패", error: error.message });
  }
};
