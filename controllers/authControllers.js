import User from "../models/User.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { generateToken, verifyTokenFromHeader } from "../utils/jwt.js";

// 개인 회원가입
export const signupPersonal = async (req, res) => {
  const { name, email, nickname, password, passwordConfirm } = req.body;

  if (!name || !email || !nickname || !password || !passwordConfirm) {
    return res.status(400).json({ message: "모든 필드를 입력해주세요." });
  }

  if (password !== passwordConfirm)
    return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });

  const exists = await User.findOne({ email });
  if (exists)
    return res.status(409).json({ message: "이미 존재하는 이메일입니다." });

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
export const signupCompany = async (req, res) => {
  const { email, companyName, password, passwordConfirm, businessNumber } =
    req.body;

  const businessFileUrl = req.file?.location;

  if (
    !email ||
    !companyName ||
    !password ||
    !passwordConfirm ||
    !businessNumber ||
    !businessFileUrl
  ) {
    return res
      .status(400)
      .json({ message: "모든 필드를 입력해주세요.(파일 포함)" });
  }

  if (password !== passwordConfirm)
    return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });

  const exists = await User.findOne({ email });
  if (exists)
    return res.status(409).json({ message: "이미 존재하는 이메일입니다." });

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
export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user)
    return res.status(401).json({ message: "존재하지 않는 사용자입니다." });

  // 기업 계정인데 승인되지 않은 경우 로그인 거부
  if (user.role === "company" && user.status !== "approved") {
    return res.status(403).json({ message: "관리자의 승인이 필요합니다." });
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch)
    return res.status(401).json({ message: "비밀번호가 틀렸습니다." });

  const token = generateToken(user._id);
  res.json({ message: "로그인 성공", token });
};

// 토큰 확인용
export const verifyToken = async (req, res) => {
  try {
    const tokenData = await verifyTokenFromHeader(req); // id만 포함됨
    const user = await User.findById(tokenData.id).select("-password"); // 전체 사용자 정보 반환
    res.json({ message: "인증 성공", user });
  } catch {
    res.status(401).json({ message: "인증 실패" });
  }
};

// 대기 중인 기업 목록 조회
export const getPendingCompanies = async (req, res) => {
  const tokenData = await verifyTokenFromHeader(req); // 토큰에서 id만 추출
  const admin = await User.findById(tokenData.id); // DB에서 유저 정보 조회
  if (!admin || admin.role !== "admin") {
    return res.status(403).json({ message: "권한이 없습니다." });
  }

  const pendingCompanies = await User.find({
    role: "company",
    status: "pending",
  });
  res.json(pendingCompanies);
};

// 기업 승인
export const approveCompany = async (req, res) => {
  const tokenData = await verifyTokenFromHeader(req); // 토큰에서 id만 추출
  const admin = await User.findById(tokenData.id); // DB에서 유저 정보 조회
  if (!admin || admin.role !== "admin") {
    return res.status(403).json({ message: "권한이 없습니다." });
  }

  const company = await User.findById(req.params.id);
  if (!company || company.role !== "company") {
    return res.status(404).json({ message: "기업 사용자를 찾을 수 없습니다." });
  }

  company.status = "approved";
  await company.save();

  res.json({ message: "승인 완료" });
};

// 기업 거절
export const rejectCompany = async (req, res) => {
  const tokenData = await verifyTokenFromHeader(req); // 토큰에서 id만 추출
  const admin = await User.findById(tokenData.id); // DB에서 유저 정보 조회
  if (!admin || admin.role !== "admin") {
    return res.status(403).json({ message: "권한이 없습니다." });
  }

  const company = await User.findById(req.params.id);
  if (!company || company.role !== "company") {
    return res.status(404).json({ message: "기업 사용자를 찾을 수 없습니다." });
  }

  company.status = "rejected";
  await company.save();

  res.json({ message: "거절 완료" });
};
