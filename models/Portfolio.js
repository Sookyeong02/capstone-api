import mongoose from "mongoose";

const contentBlockSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["text", "image", "youtube", "code"], // 여기에 추가
    required: true,
  },
  content: {
    type: String, // 텍스트, 이미지 URL, 유튜브 링크, 코드 문자열 등
    required: true,
  },
});

const PortfolioSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    category: String,
    tags: [String],
    contentBlocks: [contentBlockSchema], // 자유 블록 조합
    thumbnail: String,
    likesCount: { type: Number, default: 0 },
  },
  { timestamps: true } // createdAt, updatedAt를 자동으로 해줌
);

const Portfolio = mongoose.model("Portfolio", PortfolioSchema);
// model: 객체를 생성/조회/수정/삭제할 수 있는 인터페이스

export default Portfolio;
