import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    portfolioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Portfolio",
      required: true,
    },
  },
  { timestamps: true }
);

// 유저 하나가 같은 포트폴리오에 중복 좋아요 못 하도록 유니크 설정
likeSchema.index({ userId: 1, portfolioId: 1 }, { unique: true });

export default mongoose.model("Like", likeSchema);
