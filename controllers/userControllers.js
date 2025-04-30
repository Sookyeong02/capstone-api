import User from "../models/User.js";
import Portfolio from "../models/Portfolio.js";
import { verifyTokenFromHeader } from "../utils/jwt.js";
import { hashPassword } from "../utils/password.js";

// export const updateProfile = async (req, res) => {
//   try {
//     const tokenData = await verifyTokenFromHeader(req);
//     const user = await User.findById(tokenData.id);

//     if (!user)
//       return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });

//     const {
//       nickname,
//       introduction,
//       personalWebsite,
//       companyIntroduction,
//       companyWebsite,
//       profileImage,
//     } = req.body;

//     if (user.role === "personal") {
//       if (nickname) user.nickname = nickname;
//       if (introduction) user.introduction = introduction;
//       if (personalWebsite) user.personalWebsite = personalWebsite;
//     } else if (user.role === "company") {
//       if (companyIntroduction) user.companyIntroduction = companyIntroduction;
//       if (companyWebsite) user.companyWebsite = companyWebsite;
//     }

//     if (profileImage) user.profileImage = profileImage;

//     await user.save();

//     res.json({
//       id: user._id,
//       email: user.email,
//       nickname: user.nickname || "",
//       profileImageUrl: user.profileImage || "",
//       createdAt: user.createdAt,
//       updatedAt: user.updatedAt,
//     });
//   } catch {
//     res.status(401).json({ message: "인증 실패" });
//   }
// };

// (개인) 내 정보 수정
export const updatePersonalProfile = async (req, res) => {
  try {
    const tokenData = await verifyTokenFromHeader(req);
    const user = await User.findById(tokenData.id);

    if (!user || user.role !== "personal") {
      return res.status(403).json({ message: "권한이 없습니다." });
    }

    const {
      name,
      nickname,
      email,
      password,
      introduction,
      personalWebsite,
      profileImage,
    } = req.body;

    if (name) user.name = name;
    if (nickname) user.nickname = nickname;
    if (email) user.email = email;
    if (password) user.password = await hashPassword(password);
    if (introduction) user.introduction = introduction;
    if (personalWebsite) user.personalWebsite = personalWebsite;
    if (profileImage) user.profileImage = profileImage;

    await user.save();

    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      nickname: user.nickname,
      profileImageUrl: user.profileImage || "",
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    res.status(401).json({ message: "인증 실패" });
  }
};

// (기업) 내 정보 수정
export const updateCompanyProfile = async (req, res) => {
  try {
    const tokenData = await verifyTokenFromHeader(req);
    const user = await User.findById(tokenData.id);

    if (!user || user.role !== "company") {
      return res.status(403).json({ message: "권한이 없습니다." });
    }

    const {
      companyName,
      email,
      password,
      businessNumber,
      businessFileUrl,
      companyIntroduction,
      companyWebsite,
      profileImage,
    } = req.body;

    // if (companyName) user.companyName = companyName;
    if (companyName && companyName !== user.companyName) {
      user.companyName = companyName;
      user.status = "pending"; // 승인 다시 받도록
    }
    if (email) user.email = email;
    if (password) user.password = await hashPassword(password);
    if (businessNumber) user.businessNumber = businessNumber;
    if (businessFileUrl) user.businessFileUrl = businessFileUrl;
    if (companyIntroduction) user.companyIntroduction = companyIntroduction;
    if (companyWebsite) user.companyWebsite = companyWebsite;
    if (profileImage) user.profileImage = profileImage;

    await user.save();

    res.json({
      id: user._id,
      email: user.email,
      companyName: user.companyName,
      profileImageUrl: user.profileImage || "",
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      status: user.status,
    });
  } catch (err) {
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
