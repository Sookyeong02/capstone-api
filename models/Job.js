import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    category: String,
    content: String,
    link: String, // 지원 링크
    deadline: Date, // 마감일
    ocation: String, // 근무지
    thumbnail: String, // 썸네일 이미지 URL
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
