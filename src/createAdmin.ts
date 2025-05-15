import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "./models/User";

dotenv.config();

const createAdmin = async () => {
  try {
    const dbUrl = process.env.DATABASE_URL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!dbUrl || !adminPassword) {
      throw new Error(
        "환경변수 DATABASE_URL 또는 ADMIN_PASSWORD가 설정되지 않았습니다."
      );
    }
    await mongoose.connect(dbUrl);
    const exists = await User.findOne({ email: "capstone@gmail.com" });
    if (exists) {
      console.log("이미 존재하는 관리자 계정입니다.");
      process.exit(0);
    }

    const hashed = await bcrypt.hash(adminPassword, 10);

    await User.create({
      email: "capstone@gmail.com",
      password: hashed,
      role: "admin",
      provider: "local",
      status: "approved",
    });

    console.log("관리자 계정 생성 완료!");
    process.exit();
  } catch (err) {
    console.error("관리자 계정 생성 실패:", err);
    process.exit(1);
  }
};

createAdmin();
