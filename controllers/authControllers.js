import User from "../models/User.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { generateToken, verifyTokenFromHeader } from "../utils/jwt.js";

// 개인 회원가입
export const signupPersonal = async (req, res) => {
  const { name, email, nickname, password, passwordConfirm } = req.body;

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

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch)
    return res.status(401).json({ message: "비밀번호가 틀렸습니다." });

  const token = generateToken(user._id);
  res.json({ message: "로그인 성공", token });
};

// 토큰 확인용
export const verifyToken = async (req, res) => {
  try {
    const user = await verifyTokenFromHeader(req);
    res.json({ message: "인증 성공", user });
  } catch {
    res.status(401).json({ message: "인증 실패" });
  }
};
