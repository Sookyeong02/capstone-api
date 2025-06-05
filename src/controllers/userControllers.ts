import { Request, Response } from "express";
import User from "../models/User";
import Job from "../models/Job";
import Portfolio from "../models/Portfolio";
import Like from "../models/Like";
import { verifyToken, JwtPayload } from "../utils/jwt";
import { hashPassword } from "../utils/password";

// (개인) 내 정보 수정
export const updatePersonalProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const tokenData = await verifyToken(req);
    const user = await User.findById((tokenData as JwtPayload).id);

    if (!user || user.role !== "personal") {
      res.status(403).json({ message: "권한이 없습니다." });
      return;
    }

    const {
      name,
      nickname,
      email,
      password,
      introduction,
      personalWebsite,
      profileImage,
      jobField,
    } = req.body;

    if (name) user.name = name;
    if (nickname) user.nickname = nickname;
    if (email) user.email = email;
    if (password) user.password = await hashPassword(password);
    if (introduction) user.introduction = introduction;
    if (personalWebsite) user.personalWebsite = personalWebsite;
    if (profileImage) user.profileImage = profileImage;
    if (jobField) user.jobField = jobField;

    await user.save();

    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      nickname: user.nickname,
      profileImageUrl: user.profileImage || "",
      jobField: user.jobField || "",
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    res.status(401).json({ message: "인증 실패" });
  }
};

// (기업) 내 정보 수정
export const updateCompanyProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const tokenData = await verifyToken(req);
    const user = await User.findById(tokenData.id);

    if (!user || user.role !== "company") {
      res.status(403).json({ message: "권한이 없습니다." });
      return;
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

    const isBusinessInfoUpdated =
      businessNumber &&
      businessFileUrl &&
      (businessNumber !== user.businessNumber ||
        businessFileUrl !== user.businessFileUrl);

    if (companyName) user.companyName = companyName;
    if (email) user.email = email;
    if (password) user.password = await hashPassword(password);
    if (businessNumber) user.businessNumber = businessNumber;
    if (businessFileUrl) user.businessFileUrl = businessFileUrl;
    if (companyIntroduction) user.companyIntroduction = companyIntroduction;
    if (companyWebsite) user.companyWebsite = companyWebsite;
    if (profileImage) user.profileImage = profileImage;

    // 사업자번호 또는 파일이 둘 다 수정되었을 경우에만 업데이트 및 상태 변경
    if (isBusinessInfoUpdated) {
      user.businessNumber = businessNumber;
      user.businessFileUrl = businessFileUrl;
      user.status = "pending";
    }

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
export const getMyPortfolios = async (req: Request, res: Response) => {
  try {
    const tokenData = await verifyToken(req);
    const myPortfolios = await Portfolio.find({ userId: tokenData.id }).sort({
      createdAt: -1,
    });
    res.json(myPortfolios);
  } catch {
    res.status(401).json({ message: "인증 실패" });
  }
};

// 내 채용공고 조회
export const getMyJobs = async (req: Request, res: Response) => {
  try {
    const tokenData = await verifyToken(req);
    const jobs = await Job.find({ companyId: tokenData.id }).sort({
      createdAt: -1,
    });
    res.json(jobs);
  } catch (error: any) {
    res.status(401).json({ message: "인증 실패", error: error.message });
  }
};

// 공개용 내 정보
export const getUserPublicInfoById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).lean();

    if (!user || user.role !== "personal") {
      res.status(404).json({ message: "개인 사용자 정보를 찾을 수 없습니다." });
      return;
    }

    const portfoliosCount = await Portfolio.countDocuments({ userId: id });

    const myPortfolioIds = await Portfolio.find({ userId: user._id }).select(
      "_id"
    );
    const portfolioIds = myPortfolioIds.map((p) => p._id);
    const likesReceived = await Like.countDocuments({
      portfolioId: { $in: portfolioIds },
    });

    const likesGiven = await Like.countDocuments({ userId: user._id });

    const publicUserInfo = {
      id: user._id,
      nickname: user.nickname,
      profileImageUrl: user.profileImage,
      introduction: user.introduction,
      jobField: user.jobField,
      personalWebsite: user.personalWebsite,
      portfoliosCount,
      likesReceived,
      likesGiven,
    };

    res.json(publicUserInfo);
  } catch (err) {
    res.status(500).json({ message: "사용자 정보 조회 실패", error: err });
  }
};
