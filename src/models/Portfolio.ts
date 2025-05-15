import mongoose, { Schema, Document, Types } from "mongoose";

export type ContentBlockType = "text" | "image" | "youtube" | "code";

export interface ContentBlock {
  type: ContentBlockType;
  content: string;
}

export interface Portfolio extends Document {
  userId: Types.ObjectId;
  title: string;
  category?: string;
  tags?: string[];
  contentBlocks: ContentBlock[];
  thumbnail?: string;
  likesCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const contentBlockSchema = new Schema<ContentBlock>({
  type: {
    type: String,
    enum: ["text", "image", "youtube", "code"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const portfolioSchema = new Schema<Portfolio>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    category: { type: String },
    tags: [{ type: String }],
    contentBlocks: [contentBlockSchema],
    thumbnail: { type: String },
    likesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Portfolio = mongoose.model<Portfolio>("Portfolio", portfolioSchema);
export default Portfolio;
