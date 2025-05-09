import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const secret = process.env.JWT_SECRET || "my-secret";

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, secret, { expiresIn: "7d" });
};

export const verifyTokenFromHeader = (req, res, next) => {
  try {
    const token = req.cookies.accessToken; // httpOnly 쿠키에서 가져옴
    if (!token) return res.status(401).json({ message: "토큰이 없습니다." });

    const decoded = jwt.verify(token, secret);
    req.user = decoded; // 이후 미들웨어나 컨트롤러에서 사용자 정보 접근 가능
    next(); // 인증 통과
  } catch (err) {
    return res.status(401).json({ message: "인증 실패", error: err.message });
  }
};
