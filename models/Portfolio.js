import mongoose from "mongoose";

const PortfolioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxLength: 30,
      // validate: {
      //   validator: function (title) {
      //     return title.split(" ").length > 1; // 최소 두 단어인지 확인
      //   },
      //   message: "Must contain at least 2 words.", // 밸리데이션 오류
      // },
    },
    description: {
      type: String,
    },
    isComplete: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt를 자동으로 해줌
  }
);

const Portfolio = mongoose.model("Portfolio", PortfolioSchema);
// model: 객체를 생성/조회/수정/삭제할 수 있는 인터페이스

export default Portfolio;
