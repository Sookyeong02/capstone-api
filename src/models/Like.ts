import mongoose, { Schema, Document } from "mongoose";
import { applyToJSONTransform } from "../toJSONTransform";

export interface Like extends Document {
  userId: mongoose.Types.ObjectId;
  portfolioId: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const likeSchema = new Schema<Like>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    portfolioId: {
      type: Schema.Types.ObjectId,
      ref: "Portfolio",
      required: true,
    },
  },
  { timestamps: true }
);

likeSchema.index({ userId: 1, portfolioId: 1 }, { unique: true });

applyToJSONTransform(likeSchema);

const Like = mongoose.model<Like>("Like", likeSchema);
export default Like;
