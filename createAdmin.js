import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "./models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    const exists = await User.findOne({ email: "capstone@gmail.com" });
    if (exists) {
      console.log("이미 존재하는 관리자 계정입니다.");
      process.exit();
    }

    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

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
