import User from "../models/User";
import Portfolio from "../models/Portfolio";
import Like from "../models/Like";
import jwt, { JwtPayload } from "jsonwebtoken";
import { hashPassword, comparePassword } from "../utils/password";
import { generateToken, verifyToken } from "../utils/jwt";
import { Request, Response } from "express";

// 개인 회원가입
export const signupPersonal = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email, nickname, password, passwordConfirm } = req.body;

  if (!name || !email || !nickname || !password || !passwordConfirm) {
    res.status(400).json({ message: "모든 필드를 입력해주세요." });
  }

  if (password !== passwordConfirm)
    res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });

  const exists = await User.findOne({ email });
  if (exists) res.status(409).json({ message: "이미 존재하는 이메일입니다." });

  const hashed = await hashPassword(password);

  const newUser = await User.create({
    role: "personal",
    provider: "local",
    name,
    email,
    nickname,
    password: hashed,
  });

  res.status(201).json({ message: "회원가입 성공", userId: newUser._id });
};

// 기업 회원가입
export const signupCompany = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    email,
    companyName,
    password,
    passwordConfirm,
    businessNumber,
    businessFileUrl,
  } = req.body;

  if (
    !email ||
    !companyName ||
    !password ||
    !passwordConfirm ||
    !businessNumber ||
    !businessFileUrl
  ) {
    res.status(400).json({ message: "모든 필드를 입력해주세요.(파일 포함)" });
  }

  if (password !== passwordConfirm)
    res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });

  const exists = await User.findOne({ email });
  if (exists) res.status(409).json({ message: "이미 존재하는 이메일입니다." });

  const hashed = await hashPassword(password);

  const newCompany = await User.create({
    role: "company",
    provider: "local",
    email,
    password: hashed,
    companyName,
    businessNumber,
    businessFileUrl,
    status: "pending",
  });

  res
    .status(201)
    .json({ message: "기업 회원가입 성공", userId: newCompany._id });
};

// 로그인
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({ message: "존재하지 않는 사용자입니다." });
      return;
    }

    // 기업 계정인데 승인되지 않은 경우 로그인 거부
    if (user.role === "company" && user.status !== "approved") {
      res.status(403).json({ message: "관리자의 승인이 필요합니다." });
      return;
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "비밀번호가 틀렸습니다." });
      return;
    }

    const accessToken = generateToken(user._id);
    const refreshToken = generateToken(user._id, "14d");

    const userWithoutPassword = await User.findById(user._id).select(
      "-password"
    );

    // 쿠키 설정
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 2, // 2시간
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 14, // 14일
    });

    // accessToken, refreshToken은 JSON으로 안 보냄
    res.json({
      message: "로그인 성공",
      user: userWithoutPassword,
    });
  } catch (err: any) {
    console.error("[login error]", err);
    res.status(500).json({ message: "서버 에러가 발생했습니다." });
  }
};

// 토큰 확인용
export const verifyAuthToken = async (req: Request, res: Response) => {
  try {
    const tokenData = await verifyToken(req); // id만 포함됨
    const user = await User.findById(tokenData.id).select("-password"); // 전체 사용자 정보 반환
    res.json({ message: "인증 성공", user });
  } catch {
    res.status(401).json({ message: "인증 실패" });
  }
};

const secret = process.env.JWT_SECRET! as jwt.Secret;

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies.accessToken; // 쿠키에서 accessToken 직접 읽기
    if (!token) {
      res.status(401).json({ message: "토큰이 없습니다." });
      return;
    }

    const decoded = jwt.verify(token, secret) as JwtPayload; // jwt로 복호화
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
      return;
    }

    const userResponse: any = user.toObject();

    // 개인 사용자만 포트폴리오/좋아요 정보 포함
    if (user.role === "personal") {
      // 포트폴리오 개수
      const portfoliosCount = await Portfolio.countDocuments({
        userId: user._id,
      });

      // 좋아요 받은 수 (내 포트폴리오에 달린 좋아요 수)
      const myPortfolioIds = await Portfolio.find({ userId: user._id }).select(
        "_id"
      );
      const portfolioIds = myPortfolioIds.map((p) => p._id);
      const likesReceived = await Like.countDocuments({
        portfolioId: { $in: portfolioIds },
      });

      // 내가 누른 좋아요 수
      const likesGiven = await Like.countDocuments({ userId: user._id });

      // 응답에 추가
      userResponse.portfoliosCount = portfoliosCount;
      userResponse.likesReceived = likesReceived;
      userResponse.likesGiven = likesGiven;
    }

    res.json({ user: userResponse });
  } catch (err: any) {
    res.status(401).json({ message: "인증 실패", error: err.message });
  }
};

// 로그아웃: 쿠키 삭제
export const logout = (req: Request, res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });

  res.json({ message: "로그아웃 되었습니다." });
};

// 리프레시 토큰을 이용해 accessToken 재발급
export const refreshAccessToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(401).json({ message: "리프레시 토큰 없음" });
      return;
    }

    const decoded = jwt.verify(refreshToken, secret) as JwtPayload;
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      res.status(401).json({ message: "유효하지 않은 사용자" });
      return;
    }

    const newAccessToken = jwt.sign({ id: user._id }, secret, {
      expiresIn: "2h",
    });

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 2, // 2시간
    });

    res.json({ message: "토큰 재발급 완료" });
  } catch (err: any) {
    res
      .status(401)
      .json({ message: "리프레시 토큰이 유효하지 않음", error: err.message });
  }
};

// 대기 중인 기업 목록 조회
export const getPendingCompanies = async (
  req: Request,
  res: Response
): Promise<void> => {
  const tokenData = await verifyToken(req); // 토큰에서 id만 추출
  const admin = await User.findById(tokenData.id); // DB에서 유저 정보 조회
  if (!admin || admin.role !== "admin") {
    res.status(403).json({ message: "권한이 없습니다." });
  }

  const pendingCompanies = await User.find({
    role: "company",
    status: "pending",
  });
  res.json(pendingCompanies);
};

// 기업 승인
export const approveCompany = async (
  req: Request,
  res: Response
): Promise<void> => {
  const tokenData = await verifyToken(req); // 토큰에서 id만 추출
  const admin = await User.findById(tokenData.id); // DB에서 유저 정보 조회
  if (!admin || admin.role !== "admin") {
    res.status(403).json({ message: "권한이 없습니다." });
    return;
  }

  const company = await User.findById(req.params.id);
  if (!company || company.role !== "company") {
    res.status(404).json({ message: "기업 사용자를 찾을 수 없습니다." });
    return;
  }

  company.status = "approved";
  await company.save();

  res.json({ message: "승인 완료" });
  return;
};

// 기업 거절
export const rejectCompany = async (
  req: Request,
  res: Response
): Promise<void> => {
  const tokenData = await verifyToken(req); // 토큰에서 id만 추출
  const admin = await User.findById(tokenData.id); // DB에서 유저 정보 조회
  if (!admin || admin.role !== "admin") {
    res.status(403).json({ message: "권한이 없습니다." });
    return;
  }

  const company = await User.findById(req.params.id);
  if (!company || company.role !== "company") {
    res.status(404).json({ message: "기업 사용자를 찾을 수 없습니다." });
    return;
  }

  company.status = "rejected";
  await company.save();

  res.json({ message: "거절 완료" });
  return;
};
