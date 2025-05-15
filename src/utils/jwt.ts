import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();

// 토큰 페이로드 타입 정의
export interface JwtPayload {
  id: string;
  iat?: number;
  exp?: number;
}

interface TokenPayload {
  id: string;
}

const secret: Secret = process.env.JWT_SECRET || "my-secret";

// 토큰 생성 함수
export const generateToken = (
  userId: string,
  expiresIn: SignOptions["expiresIn"] = "7d"
): string => {
  const payload: TokenPayload = { id: userId };

  return jwt.sign(payload, secret, { expiresIn });
};

// 확장된 Request 타입
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

// 토큰 검증 미들웨어
export const verifyTokenFromHeader = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.accessToken; // httpOnly 쿠키에서 가져옴
    if (!token) {
      res.status(401).json({ message: "토큰이 없습니다." });
      return;
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.user = decoded; // 이후 미들웨어나 컨트롤러에서 사용자 정보 접근 가능
    next(); // 인증 통과
  } catch (err: any) {
    res.status(401).json({ message: "인증 실패", error: err.message });
  }
};

// 함수 호출용
export const verifyToken = async (req: Request): Promise<JwtPayload> => {
  const token = req.cookies.accessToken;
  if (!token) {
    throw new Error("토큰이 없습니다.");
  }

  const decoded = jwt.verify(token, secret) as JwtPayload;
  return decoded;
};
