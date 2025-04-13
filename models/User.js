import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["personal", "company", "admin"],
      required: true,
    },
    email: { type: String, required: true, unique: true },
    password: String,
    provider: {
      type: String,
      enum: ["local", "google", "kakao"],
      default: "local",
    },
    profileImage: String,

    // 개인 사용자 필드
    name: String,
    nickname: String,
    jobField: String, // 작업 분야 (디자인, 개발 등)
    introduction: String, // 자기소개
    personalWebsite: String, // 개인 홈페이지 링크

    // 기업 전용
    companyName: String,
    businessNumber: String,
    businessFileUrl: String,
    // approved: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    companyIntroduction: String,
    companyWebsite: String,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
