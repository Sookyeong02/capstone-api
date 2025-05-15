// 이 파일은 데이터베이스를 초기 데이터로 리셋하는 역할
import mongoose from "mongoose";
import Portfolio from "../models/Portfolio.js";
import * as dotenv from "dotenv";
dotenv.config();

const run = async () => {
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    throw new Error("DATABASE_URL 환경변수가 설정되지 않았습니다.");
  }

  try {
    await mongoose.connect(dbUrl);
    console.log("MongoDB 연결 완료");

    await Portfolio.deleteMany({});
    console.log("기존 포트폴리오 데이터 제거 완료");

    await mongoose.connection.close();
    console.log("MongoDB 연결 종료");
  } catch (err) {
    const error = err as Error;
    console.error("seed 작업 실패:", error.message);
    process.exit(1);
  }
};

run();
