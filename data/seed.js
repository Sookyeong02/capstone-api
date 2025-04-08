// 이 파일은 데이터베이스를 초기 데이터로 리셋하는 역할
import mongoose from "mongoose";
import data from "./mock.js";
import Portfolio from "../models/Portfolio.js";
// import { DATABASE_URL } from "../env.js";
import * as dotenv from "dotenv";
dotenv.config();

// mongoose.connect(DATABASE_URL);
mongoose.connect(process.env.DATABASE_URL);

// 비동기 방식이라 결과를 기다리려면 await 사용
await Portfolio.deleteMany({}); // 모든 데이터 삭제
await Portfolio.insertMany(data); // 삽입할 데이터 파라미터로 받음

mongoose.connection.close(); // 데이터베이스 커넥션 종료
