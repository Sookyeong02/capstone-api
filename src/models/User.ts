import mongoose, { Document, Schema } from "mongoose";
import { applyToJSONTransform } from "../toJSONTransform";

interface CommonUser {
  role: "personal" | "company" | "admin";
  email: string;
  password: string;
  provider: "local" | "google" | "kakao";
  profileImage?: string;
  status: "pending" | "approved" | "rejected";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PersonalUser extends CommonUser {
  role: "personal";
  name: string;
  nickname: string;
  jobField?: string;
  introduction?: string;
  personalWebsite?: string;
}

export interface CompanyUser extends CommonUser {
  role: "company";
  companyName: string;
  businessNumber: string;
  businessFileUrl: string;
  companyIntroduction?: string;
  companyWebsite?: string;
}

export interface AdminUser extends CommonUser {
  role: "admin";
}

export type User = (PersonalUser | CompanyUser | AdminUser) & Document;

const userSchema = new Schema<User>(
  {
    role: {
      type: String,
      enum: ["personal", "company", "admin"],
      required: true,
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    provider: {
      type: String,
      enum: ["local", "google", "kakao"],
      default: "local",
    },
    profileImage: String,

    // 개인 사용자
    name: {
      type: String,
      required: function (this: User) {
        return this.role === "personal";
      },
    },
    nickname: {
      type: String,
      required: function (this: User) {
        return this.role === "personal";
      },
    },
    jobField: String,
    introduction: String,
    personalWebsite: String,

    // 기업 사용자
    companyName: {
      type: String,
      required: function (this: User) {
        return this.role === "company";
      },
    },
    businessNumber: {
      type: String,
      required: function (this: User) {
        return this.role === "company";
      },
    },
    businessFileUrl: {
      type: String,
      required: function (this: User) {
        return this.role === "company";
      },
    },
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

applyToJSONTransform(userSchema);

const User = mongoose.model<User>("User", userSchema);
export default User;
